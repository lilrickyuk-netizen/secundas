import {
  Platform,
} from 'react-native';

import Purchases
  from 'react-native-purchases';

import {
  loadGameData,
  updateRevenueCatCache,
} from '../utils/storage';

import {
  PRODUCT_IDS,
} from '../utils/constants';

const INITIAL_STATE = {
  status: 'idle',
  configured: false,
  offeringsLoaded: false,
  currentOfferingId: null,
  availablePackageIdentifiers: [],
activeEntitlementIds: [],
activeProductIds: [],
lastCheckedAt: null,
};

let revenueCatState = {
  ...INITIAL_STATE,
};

let initializationPromise = null;

let currentOfferings = null;

let currentCustomerInfo = null;

const stateListeners =
  new Set();

function getApiKey() {
  if (
    Platform.OS === 'android'
  ) {
    return (
      process.env
        .EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY
        ?.trim() ||
      null
    );
  }

  if (
    Platform.OS === 'ios'
  ) {
    return (
      process.env
        .EXPO_PUBLIC_REVENUECAT_IOS_API_KEY
        ?.trim() ||
      null
    );
  }

  return null;
}

function snapshotState() {
  return {
    ...revenueCatState,

    availablePackageIdentifiers: [
      ...revenueCatState
        .availablePackageIdentifiers,
    ],

    activeEntitlementIds: [
      ...revenueCatState
        .activeEntitlementIds,
    ],

    activeProductIds: [
  ...revenueCatState
    .activeProductIds,
],

  };
}

function publishState(update) {
  revenueCatState = {
    ...revenueCatState,
    ...update,
  };

  const snapshot =
    snapshotState();

  stateListeners.forEach(
    (listener) => {
      try {
        listener(snapshot);
      } catch (error) {
        console.warn(
          'RevenueCat state listener failed:',
          error
        );
      }
    }
  );

  return snapshot;
}

async function hydrateCachedState() {
  const gameData =
    await loadGameData();

  const cached =
    gameData.purchases
      ?.revenueCat;

  if (
    !cached ||
    typeof cached !== 'object'
  ) {
    return;
  }

  publishState({
    activeEntitlementIds:
      Array.isArray(
        cached.activeEntitlementIds
      )
        ? cached.activeEntitlementIds
        : [],

        activeProductIds:
  Array.isArray(
    cached.activeProductIds
  )
    ? cached.activeProductIds
    : [],

    currentOfferingId:
      typeof cached
        .currentOfferingId ===
      'string'
        ? cached.currentOfferingId
        : null,

    availablePackageIdentifiers:
      Array.isArray(
        cached
          .availablePackageIdentifiers
      )
        ? cached
            .availablePackageIdentifiers
        : [],

    lastCheckedAt:
      Number.isFinite(
        cached.lastCheckedAt
      )
        ? cached.lastCheckedAt
        : null,
  });
}

async function persistState() {
  const snapshot =
    snapshotState();

  await updateRevenueCatCache({
    configured:
      snapshot.configured,

    status:
      snapshot.status,

    offeringsLoaded:
      snapshot.offeringsLoaded,

    currentOfferingId:
      snapshot.currentOfferingId,

    availablePackageIdentifiers:
      snapshot
        .availablePackageIdentifiers,

    activeEntitlementIds:
      snapshot
        .activeEntitlementIds,

        activeProductIds:
  snapshot
    .activeProductIds,

    lastCheckedAt:
      snapshot.lastCheckedAt,
  });
}

function summarizeOfferings(
  offerings
) {
  const current =
    offerings?.current ??
    null;

  const availablePackages =
    Array.isArray(
      current
        ?.availablePackages
    )
      ? current
          .availablePackages
      : [];

  return {
    offeringsLoaded: true,

    currentOfferingId:
      typeof current
        ?.identifier ===
      'string'
        ? current.identifier
        : null,

    availablePackageIdentifiers:
      availablePackages
        .map(
          (item) =>
            item?.identifier
        )
        .filter(
          (identifier) =>
            typeof identifier ===
              'string' &&
            identifier.length >
              0
        ),
  };
}

function summarizeCustomerInfo(
  customerInfo
) {
  const activeEntitlements =
    customerInfo
      ?.entitlements
      ?.active ?? {};

  const activeProductIds =
    [
      ...new Set(
        Object.values(
          activeEntitlements
        )
          .map(
            (entitlement) =>
              entitlement
                ?.productIdentifier
          )
          .filter(
            (identifier) =>
              typeof identifier ===
                'string' &&
              identifier.length >
                0
          )
      ),
    ];

  return {
    activeEntitlementIds:
      Object.keys(
        activeEntitlements
      ),

    activeProductIds,
  };
}

export function getRevenueCatState() {
  return snapshotState();
}

export function getRevenueCatOfferings() {
  return currentOfferings;
}

export function getRevenueCatCustomerInfo() {
  return currentCustomerInfo;
}

export function getRevenueCatAccessState(
  state = revenueCatState
) {
  const activeProductIds =
    Array.isArray(
      state
        ?.activeProductIds
    )
      ? state
          .activeProductIds
      : [];

  const activeEntitlementIds =
    Array.isArray(
      state
        ?.activeEntitlementIds
    )
      ? state
          .activeEntitlementIds
      : [];

  const owns =
    (productId) =>
      activeProductIds.includes(
        productId
      ) ||
      activeEntitlementIds.includes(
        productId
      );

  const hasLifetimeAccess =
    owns(
      PRODUCT_IDS.lifetime
    );

  return {
    hasLifetimeAccess,

    hasProAccess:
      hasLifetimeAccess ||
      owns(
        PRODUCT_IDS.proMode
      ),

    hasSkinsAccess:
      hasLifetimeAccess ||
      owns(
        PRODUCT_IDS
          .unlockSkins
      ),
  };
}

function getCurrentPackages() {
  const packages =
    currentOfferings
      ?.current
      ?.availablePackages;

  return Array.isArray(packages)
    ? packages
    : [];
}

function getPackageStoreProduct(
  aPackage
) {
  return (
    aPackage?.storeProduct ??
    null
  );
}

function findPackageForProduct(
  productId
) {
  if (
    typeof productId !==
      'string' ||
    productId.length === 0
  ) {
    return null;
  }

  return (
    getCurrentPackages().find(
      (aPackage) => {
        const product =
          getPackageStoreProduct(
            aPackage
          );

        return (
          product?.identifier ===
          productId
        );
      }
    ) ?? null
  );
}

export function getRevenueCatProduct(
  productId
) {
  const aPackage =
    findPackageForProduct(
      productId
    );

  if (!aPackage) {
    return null;
  }

  const product =
    getPackageStoreProduct(
      aPackage
    );

  return {
    productId,

    packageIdentifier:
      aPackage.identifier ??
      null,

    priceString:
      product?.priceString ??
      null,
  };
}

export async function purchaseRevenueCatProduct(
  productId
) {
  if (
    !revenueCatState.configured
  ) {
    return {
      status: 'unavailable',
      reason: 'not_configured',
    };
  }

  let aPackage =
    findPackageForProduct(
      productId
    );

  if (!aPackage) {
    await refreshRevenueCat();

    aPackage =
      findPackageForProduct(
        productId
      );
  }

  if (!aPackage) {
    return {
      status: 'unavailable',
      reason:
        'product_not_found',
    };
  }

  try {
    const {
      customerInfo,
    } =
      await Purchases
        .purchasePackage(
          aPackage
        );

    currentCustomerInfo =
      customerInfo;

    const nextState =
      publishState({
        ...summarizeCustomerInfo(
          customerInfo
        ),

        status: 'ready',

        lastCheckedAt:
          Date.now(),
      });

    try {
      await persistState();
    } catch (error) {
      console.warn(
        'RevenueCat purchase cache write failed:',
        error
      );
    }

    return {
      status: 'purchased',
      productId,
      customerInfo,
      state: nextState,
    };
  } catch (error) {
    if (
      error?.userCancelled ===
      true
    ) {
      return {
        status: 'cancelled',
      };
    }

    console.warn(
      'RevenueCat purchase failed:',
      error
    );

    return {
      status: 'error',
      reason:
        'purchase_failed',
    };
  }
}

export async function restoreRevenueCatPurchases() {
  if (
    !revenueCatState.configured
  ) {
    return {
      status: 'unavailable',
      reason: 'not_configured',
    };
  }

  try {
    const customerInfo =
      await Purchases.restorePurchases();

    currentCustomerInfo =
      customerInfo;

    const nextState =
      publishState({
        ...summarizeCustomerInfo(
          customerInfo
        ),

        status: 'ready',

        lastCheckedAt:
          Date.now(),
      });

    try {
      await persistState();
    } catch (error) {
      console.warn(
        'RevenueCat restore cache write failed:',
        error
      );
    }

    return {
      status: 'restored',

      customerInfo,

      activeEntitlementIds:
        nextState
          .activeEntitlementIds,

      state: nextState,
    };
  } catch (error) {
    if (
      error?.userCancelled ===
      true
    ) {
      return {
        status: 'cancelled',
      };
    }

    console.warn(
      'RevenueCat restore failed:',
      error
    );

    return {
      status: 'error',
      reason: 'restore_failed',
    };
  }
}

export function subscribeRevenueCatState(
  listener
) {
  if (
    typeof listener !==
    'function'
  ) {
    return () => {};
  }

  stateListeners.add(
    listener
  );

  return () => {
    stateListeners.delete(
      listener
    );
  };
}

export async function refreshRevenueCat() {
  if (
    !revenueCatState
      .configured
  ) {
    return snapshotState();
  }

  const [
    offeringsResult,
    customerInfoResult,
  ] =
    await Promise.allSettled([
      Purchases.getOfferings(),
      Purchases.getCustomerInfo(),
    ]);

  const update = {
    lastCheckedAt:
      Date.now(),
  };

  let failureCount = 0;

  if (
    offeringsResult.status ===
    'fulfilled'
  ) {
    currentOfferings =
      offeringsResult.value;

    Object.assign(
      update,
      summarizeOfferings(
        offeringsResult.value
      )
    );
  } else {
    failureCount += 1;

    currentOfferings =
      null;

    update.offeringsLoaded =
      false;

    console.warn(
      'RevenueCat offerings unavailable:',
      offeringsResult.reason
    );
  }

  if (
    customerInfoResult
      .status ===
    'fulfilled'
  ) {
    currentCustomerInfo =
      customerInfoResult.value;

    Object.assign(
      update,
      summarizeCustomerInfo(
        customerInfoResult
          .value
      )
    );
  } else {
    failureCount += 1;

    console.warn(
      'RevenueCat customer info unavailable:',
      customerInfoResult.reason
    );
  }

  update.status =
    failureCount === 0
      ? 'ready'
      : failureCount === 2
        ? 'unavailable'
        : 'degraded';

  const nextState =
    publishState(update);

  try {
    await persistState();
  } catch (error) {
    console.warn(
      'RevenueCat cache write failed:',
      error
    );
  }

  return nextState;
}

export function initializeRevenueCat() {
  if (
    initializationPromise
  ) {
    return initializationPromise;
  }

  initializationPromise =
    (async () => {
      try {
        await hydrateCachedState();
      } catch (error) {
        console.warn(
          'RevenueCat cache hydration failed:',
          error
        );
      }

      const apiKey =
        getApiKey();

      if (!apiKey) {
        const nextState =
          publishState({
            status:
              'not_configured',

            configured:
              false,

            offeringsLoaded:
              false,

            currentOfferingId:
              null,

            availablePackageIdentifiers:
              [],
          });

        try {
          await persistState();
        } catch (error) {
          console.warn(
            'RevenueCat cache write failed:',
            error
          );
        }

        return nextState;
      }

      publishState({
        status:
          'initializing',

        configured:
          false,
      });

      try {
        await Purchases.configure({
          apiKey,
        });
      } catch (error) {
        const nextState =
          publishState({
            status:
              'unavailable',

            configured:
              false,
          });

        try {
          await persistState();
        } catch (
          cacheError
        ) {
          console.warn(
            'RevenueCat cache write failed:',
            cacheError
          );
        }

        console.warn(
          'RevenueCat configuration failed:',
          error
        );

        return nextState;
      }

      publishState({
        configured: true,
      });

      return refreshRevenueCat();
    })();

  return initializationPromise;
}