import {
  Platform,
} from 'react-native';

import * as Notifications
  from 'expo-notifications';

import {
  getDailySeed,
} from '../utils/dailyChallenge';

const CHANNEL_ID =
  'daily-challenges';

const REMINDER_DAYS_AHEAD =
  30;

let lastSyncSignature =
  null;

Notifications.setNotificationHandler({
  handleNotification:
    async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
});

function permissionGranted(
  permissions
) {
  if (
    permissions?.granted === true
  ) {
    return true;
  }

  return (
    permissions?.ios?.status ===
    Notifications
      .IosAuthorizationStatus
      .PROVISIONAL
  );
}

async function createAndroidChannel() {
  if (
    Platform.OS !== 'android'
  ) {
    return;
  }

  await Notifications
    .setNotificationChannelAsync(
      CHANNEL_ID,
      {
        name:
          'Daily Challenges',

        description:
          'Secundas Daily Challenge reminders',

        importance:
          Notifications
            .AndroidImportance
            .DEFAULT,

        vibrationPattern: [
          0,
          180,
        ],

        lightColor:
          '#FF2D55',
      }
    );
}

async function requestNotificationPermission() {
  try {
    await createAndroidChannel();

    const current =
      await Notifications
        .getPermissionsAsync();

    if (
      permissionGranted(
        current
      )
    ) {
      return true;
    }

    if (
      current.canAskAgain ===
      false
    ) {
      return false;
    }

    const requested =
      await Notifications
        .requestPermissionsAsync();

    return permissionGranted(
      requested
    );
  } catch (error) {
    console.warn(
      'Notification permission failed:',
      error
    );

    return false;
  }
}

function isSecundasNotification(
  request
) {
  return (
    request?.content?.data
      ?.secundasNotification ===
    true
  );
}

async function clearSecundasSchedules() {
  const scheduled =
    await Notifications
      .getAllScheduledNotificationsAsync();

  const secundasScheduled =
    scheduled.filter(
      isSecundasNotification
    );

  await Promise.all(
    secundasScheduled.map(
      (request) =>
        Notifications
          .cancelScheduledNotificationAsync(
            request.identifier
          )
    )
  );
}

async function scheduleMidnightNotification() {
  await Notifications
    .scheduleNotificationAsync({
      content: {
        title: 'SECUNDAS',

        body:
          'New daily challenge is live! 🔥',

        sound: 'default',

        data: {
          secundasNotification:
            true,

          type:
            'daily-live',
        },
      },

      trigger: {
        type:
          Notifications
            .SchedulableTriggerInputTypes
            .DAILY,

        hour: 0,

        minute: 0,

        channelId:
          CHANNEL_ID,
      },
    });
}

function getEightPmDate(
  dayOffset
) {
  const now = new Date();

  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() +
      dayOffset,
    20,
    0,
    0,
    0
  );
}

async function scheduleEveningReminder(
  date
) {
  const dateSeed =
    getDailySeed(date);

  await Notifications
    .scheduleNotificationAsync({
      content: {
        title: 'SECUNDAS',

        body:
          'Still time for today’s challenge.',

        sound: 'default',

        data: {
          secundasNotification:
            true,

          type:
            'daily-reminder',

          date:
            dateSeed,
        },
      },

      trigger: {
        type:
          Notifications
            .SchedulableTriggerInputTypes
            .DATE,

        date,

        channelId:
          CHANNEL_ID,
      },
    });
}

export async function syncDailyNotifications({
  todayDate,
  todayCompleted,
}) {
  const signature =
    `${todayDate}:${todayCompleted}`;

  if (
    signature ===
    lastSyncSignature
  ) {
    return true;
  }

  lastSyncSignature =
    signature;

  const permitted =
    await requestNotificationPermission();

  if (!permitted) {
    return false;
  }

  try {
    await clearSecundasSchedules();

    await scheduleMidnightNotification();

    const now = new Date();

    for (
      let dayOffset = 0;
      dayOffset <
        REMINDER_DAYS_AHEAD;
      dayOffset += 1
    ) {
      const reminderDate =
        getEightPmDate(
          dayOffset
        );

      if (
        reminderDate <= now
      ) {
        continue;
      }

      const reminderSeed =
        getDailySeed(
          reminderDate
        );

      if (
        reminderSeed ===
          todayDate &&
        todayCompleted
      ) {
        continue;
      }

      await scheduleEveningReminder(
        reminderDate
      );
    }

    return true;
  } catch (error) {
    lastSyncSignature =
      null;

    console.warn(
      'Notification scheduling failed:',
      error
    );

    return false;
  }
}

export async function cancelDailyReminder(
  date
) {
  try {
    const scheduled =
      await Notifications
        .getAllScheduledNotificationsAsync();

    const reminders =
      scheduled.filter(
        (request) =>
          request?.content?.data
            ?.secundasNotification ===
            true &&
          request?.content?.data
            ?.type ===
            'daily-reminder' &&
          request?.content?.data
            ?.date === date
      );

    await Promise.all(
      reminders.map(
        (request) =>
          Notifications
            .cancelScheduledNotificationAsync(
              request.identifier
          )
      )
    );

    return true;
  } catch (error) {
    console.warn(
      'Daily reminder cancellation failed:',
      error
    );

    return false;
  }
}