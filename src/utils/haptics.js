import * as Haptics from 'expo-haptics';

const NEAR_MISS_GAP_MS = 80;

const LEVEL_COMPLETE_DELAY_MS =
  120;

function wait(milliseconds) {
  return new Promise(
    (resolve) => {
      setTimeout(
        resolve,
        milliseconds
      );
    }
  );
}

async function runSafely(
  hapticAction
) {
  try {
    await hapticAction();
  } catch (error) {
    console.warn(
      'Haptics unavailable:',
      error
    );
  }
}

function isEnabled(options) {
  return options?.enabled !== false;
}

export async function playSuccessHaptic(
  options = {}
) {
  if (!isEnabled(options)) {
    return;
  }

  const style =
    options.reducedIntensity
      ? Haptics
          .ImpactFeedbackStyle
          .Soft
      : Haptics
          .ImpactFeedbackStyle
          .Light;

  await runSafely(() =>
    Haptics.impactAsync(style)
  );
}

export async function playFailHaptic(
  options = {}
) {
  if (!isEnabled(options)) {
    return;
  }

  const style =
    options.reducedIntensity
      ? Haptics
          .ImpactFeedbackStyle
          .Medium
      : Haptics
          .ImpactFeedbackStyle
          .Heavy;

  await runSafely(() =>
    Haptics.impactAsync(style)
  );
}

export async function playNearMissHaptic(
  options = {}
) {
  if (!isEnabled(options)) {
    return;
  }

  const style =
    options.reducedIntensity
      ? Haptics
          .ImpactFeedbackStyle
          .Soft
      : Haptics
          .ImpactFeedbackStyle
          .Light;

  await runSafely(() =>
    Haptics.impactAsync(style)
  );

  await wait(
    NEAR_MISS_GAP_MS
  );

  await runSafely(() =>
    Haptics.impactAsync(style)
  );
}

export async function playLevelCompleteHaptic(
  options = {}
) {
  if (!isEnabled(options)) {
    return;
  }

  await wait(
    LEVEL_COMPLETE_DELAY_MS
  );

  await runSafely(() =>
    Haptics.notificationAsync(
      Haptics
        .NotificationFeedbackType
        .Success
    )
  );
}

export async function playMilestoneHaptic(
  options = {}
) {
  if (!isEnabled(options)) {
    return;
  }

  await runSafely(() =>
    Haptics.notificationAsync(
      Haptics
        .NotificationFeedbackType
        .Success
    )
  );
}