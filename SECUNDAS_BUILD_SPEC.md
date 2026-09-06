# SECUNDAS — Complete Build Specification

**One tap. One second. Endless rage.**

**Owner:** Richard Curley  
**Product:** Secundas  
**Status:** AUTHORITATIVE PRODUCTION BUILD SPECIFICATION  
**Framework:** React Native + Expo + EAS Build  
**Primary release target:** Android / Google Play  
**Build mode:** Offline-first, production-ready mobile game  
**Current build sequence:** 46 implementation phases  
**Visual authority:** Written specification + locked Secundas finished-product reference image  

---

# 0. Authority, Naming, and Locked Corrections

This document is the source of truth for Secundas.

Before any code is produced, repaired, audited, or declared complete:

1. Read this specification first.
2. Inspect the actual current repository second.
3. Identify only genuine mismatches between the current code and this specification.
4. Make the smallest correct change for the current phase.
5. Verify the build and relevant runtime behaviour.
6. Commit and push.
7. Audit the exact pushed commit.
8. Only then mark the phase complete.

A successful Expo export proves build/syntax integrity only. It does **not** by itself prove runtime correctness, gameplay correctness, or visual compliance.

Do not:

- reinterpret the design;
- simplify locked requirements;
- silently change the difficulty curve;
- introduce later-phase features early unless required for the current phase to function;
- replace correct implementation because another model prefers a different design;
- add ads;
- add Firebase;
- add invasive permissions;
- make Supabase mandatory;
- make RevenueCat mandatory for gameplay;
- make internet access mandatory for gameplay;
- introduce demo-only logic;
- leave fake buttons;
- leave core TODOs and call the phase complete.

## Final name

The original working title was **Last Second**.

The final product name is:

# SECUNDAS

All user-facing references must use **SECUNDAS**.

The old name may remain only in historical notes if clearly labelled as the retired working title.

## Final tagline

**One tap. One second. Endless rage.**

## Final deep-link scheme

```text
secundas://
```

## Final Android package

```text
com.secundas.game
```

## Universal-link target

```text
https://secundas.app/c/{level}/{score}/{seed}
```

If the final registered domain changes, replace only the domain consistently.

## Visual-reference rule

The locked finished-product reference image is the visual target.

The implementation must progressively converge on that design.

The screenshot values such as:

```text
LEVEL 07
47 ATTEMPTS
```

are illustrative game state only.

They must never become hard-coded gameplay state.

The reference image does **not** override the written difficulty rules or attempt-colour thresholds.

## Locked difficulty correction

After Level 4, the safe zone shrinks by **4 percentage points per level**.

It is linear percentage-point subtraction:

```text
L4 = 45%
L5 = 41%
L6 = 37%
L7 = 33%
```

until the 30 px minimum safe-arc floor is reached.

Do **not** convert this to exponential decay.

## Locked attempt-count correction

Every valid stop tap counts as exactly **one attempt**, whether the tap succeeds or fails.

A first-tap success records:

```text
1 attempt
```

A failed tap must never increment twice.

## Locked near-miss correction

A near miss is still a failure.

The Death Modal must show:

```text
FAIL
SO CLOSE!
```

when applicable.

`SO CLOSE!` does not replace `FAIL`.

---

# 1. Product Definition

Secundas is a fast, brutal, futuristic one-tap mobile timing game built around reflexes, frustration, retries, sound, and sharing.

The core mechanic is simple:

A moving indicator travels around a neon timing arena.

The player taps to stop it.

If it lands inside the safe zone, they pass.

If it misses, they fail and try again.

The game looks easy.

It is not.

The product is designed around:

1. Instant understanding.
2. Brutal difficulty.
3. Fast retries.
4. Attempt-count frustration.
5. Intense futuristic sound.
6. Shareable suffering.
7. Friend challenges.
8. Daily challenges.
9. Futuristic neon arcade visuals.
10. Zero or near-zero monthly operating cost at launch.

This is a complete production build specification.

This is not a prototype.

This is not a demo.

This is not a partial build.

The game must be ready for Play Store internal testing and production release.

---

# 2. Core Promise

Game name:

```text
SECUNDAS
```

Tagline:

```text
One tap. One second. Endless rage.
```

Core hook:

```text
“I beat Level 7 in 47 tries. Can you do better?”
```

The game must make players feel:

1. “That looked easy.”
2. “I was so close.”
3. “One more try.”
4. “I need to beat my friend.”
5. “I have to share this.”

The product loop must turn a tiny mechanic into an emotional challenge.

---

# 3. Visual Identity

Secundas must look visually futuristic, premium, sharp, and intense.

The game must not look like a basic React Native prototype.

The style is:

1. Dark sci-fi arcade.
2. Neon timing arena.
3. Cyber reflex test.
4. Minimal HUD.
5. High-contrast rage game.
6. Premium futuristic mobile game.

Visual mood:

- Fast.
- Sharp.
- Neon.
- Brutal.
- Addictive.
- Futuristic.

## Core palette

```js
export const COLORS = {
  background: '#050507',
  panel: '#0D0D12',
  glass: 'rgba(255,255,255,0.06)',
  text: '#F5F7FA',
  muted: '#7A7F8C',
  accent: '#FF2D55',
  safe: '#00FF88',
  electric: '#00D1FF',
  warning: '#FF9F0A',
  danger: '#3A0710',
  fail: '#FF0044',
  success: '#00FF88'
};
```

## Visual rules

1. The orbit ring must glow.
2. The safe zone must glow neon green.
3. The fail/danger zone must pulse red on failure.
4. The dot must leave a subtle motion trail.
5. The background must use subtle animated grid, noise, scanline, targeting-line, or radial effects.
6. The attempt counter must feel like a futuristic scoreboard.
7. The death modal must feel sharp and brutal.
8. The success modal must feel like a clean neon victory screen.
9. Share cards must look premium enough that users want to post them.
10. No cartoon style.
11. No childish colours.
12. No generic casual-game look.
13. No clutter.
14. No cheap ad-like graphics.

## Game arena

1. Central circular orbit arena.
2. Neon safe arc.
3. Dark red danger arc.
4. White or electric-blue dot.
5. Faint circular grid lines.
6. Subtle radial glow behind arena.
7. Small pulse on every orbit pass where appropriate.
8. Screen flash on fail and success.
9. Safe-zone shrinking transition.
10. Level-transition scanline.

## Typography

Use bold futuristic typography where practical.

If custom fonts are not used, use system fonts with:

1. Heavy weight.
2. Wide letter spacing.
3. Uppercase labels.
4. Large numeric displays.
5. High contrast.

## Locked Home-screen reference

The Home screen must match the finished Secundas reference.

Required visual structure:

1. Large **SECUNDAS** wordmark.
2. Eclipse/orbit graphic behind the wordmark.
3. Subtle red rim light.
4. Primary pill CTA:
   ```text
   START
   ```
5. Secondary electric-blue pill CTA:
   ```text
   CONTINUE LEVEL
   ```
6. Daily Challenge trophy card.
7. TODAY badge.
8. Electric-blue countdown timer.
9. Three-stat row:
   - Streak
   - Total Attempts
   - Levels Complete
10. Stat order:
    - icon
    - label
    - number
11. Challenges row with red numeric badge.
12. Settings row.
13. Premium black-glass presentation.
14. No generic list-menu appearance.

Marketing copy placed outside the phone frame in promotional artwork is not automatically part of the in-app UI.

## Locked Game-screen reference

Top-left:

```text
LEVEL X
```

with thin progress underline.

Upper/right HUD may show a short flavour phrase.

Center/top:

- huge attempt number;
- ATTEMPTS label;
- faint oversized ghosted level number in background.

Middle:

- circular neon arena;
- green glowing safe arc;
- red glowing danger arc;
- faint radial grid;
- centre crosshair;
- electric-blue moving dot;
- visible electric-blue motion trail/comet tail.

Instruction:

```text
TAP TO STOP
HIT THE SAFE ZONE
```

Bottom:

```text
MUTE
EXIT
```

as two equal-weight glass pill controls.

---

# 4. Sound Identity

Secundas must have an intense futuristic sound identity.

Sound is part of the game’s addictive loop.

The audio style is:

1. Dark sci-fi arcade.
2. Cybernetic reflex test.
3. Short impact sounds.
4. Rising tension.
5. Sharp failure hits.
6. Clean victory pulses.

The game must not use:

- cartoon sounds;
- cheap mobile-game jingles;
- childish effects;
- long background music.

Sound must support the gameplay loop:

1. Waiting = tension.
2. Tap = impact.
3. Near miss = pain.
4. Fail = brutal hit.
5. Success = release.
6. Level complete = victory pulse.
7. Daily challenge = alarm-like energy.
8. Challenge received = social tension.
9. Share card generated = trophy moment.

## Sound rules

1. All sounds must be short.
2. Sounds must never slow the retry loop.
3. Sounds must feel futuristic and intense.
4. Sounds must be optional with a mute toggle.
5. Sounds must not use copyrighted audio.
6. Sound volume must be balanced, not painful.
7. Haptics and sound must work together.
8. No background music in v1.
9. No looping music.
10. No distracting audio during fast retries.

## Required sounds

### 1. Orbit pulse

Subtle low pulse every full orbit or every few seconds.

Purpose: builds tension.

Style: soft electronic scanner pulse.

### 2. Tap sound

Very short digital click.

Purpose: confirms input.

Style: sharp cyber tick.

### 3. Success tap

Quick rising electronic tone.

Purpose: immediate reward.

Style: bright neon chirp.

### 4. Fail sound

Heavy low electronic hit.

Purpose: brutal feedback.

Style: bass thud plus digital distortion.

### 5. Near miss

Two sharp glitch ticks followed by a short drop.

Purpose: frustration.

Style: “you nearly had it” pain sound.

### 6. Level complete

Fast rising arpeggio.

Purpose: victory.

Style: clean futuristic unlock sound.

### 7. Hard level unlock

Deep mechanical pulse.

Purpose: signals the game got serious.

### 8. Daily challenge open

Short alarm-like cyber pulse.

Purpose: makes daily challenge feel important.

### 9. Challenge received

Electric ping.

Purpose: social tension.

### 10. Share card generated

Soft digital flash.

Purpose: trophy moment.

---

# 5. Sound Asset Installation Rule

The build must source and install all sound effects required for launch.

The game must not launch with missing sounds.

The user must not have to manually find or add sound files later unless direct acquisition is genuinely blocked by licensing/download access.

Use only free, royalty-free, commercially usable sound effects.

Allowed sources:

1. Pixabay sound effects.
2. Freesound sounds with CC0 licence only.
3. OpenGameArt assets with CC0 or public-domain licence only.
4. Kenney audio assets where licence permits commercial use.
5. Zapsplat free assets only if attribution and terms are documented clearly.

Preferred licence:

```text
CC0 / public domain
```

Avoid:

1. Copyrighted audio.
2. Unclear licences.
3. Attribution-required assets unless attribution is added properly.
4. Music loops.
5. Cartoon sounds.
6. Childish mobile-game sounds.
7. Long background tracks.
8. Sounds requiring paid subscription.
9. Sounds that cannot be used commercially.

Install sound files into:

```text
src/assets/sounds/
```

Required files:

```text
tap.wav
success.wav
fail.wav
near_miss.wav
level_complete.wav
daily_open.wav
challenge_ping.wav
share_ready.wav
orbit_pulse.wav
hard_level.wav
```

## Sound style requirements

### tap.wav

Short futuristic digital click.

### success.wav

Quick rising electronic tone.

### fail.wav

Heavy low cyber hit or digital thud.

### near_miss.wav

Two sharp glitch ticks or tense near-hit sound.

### level_complete.wav

Fast futuristic rising arpeggio or unlock pulse.

### daily_open.wav

Short cyber alarm pulse.

### challenge_ping.wav

Electric social challenge ping.

### share_ready.wav

Soft digital flash or trophy-ready sound.

### orbit_pulse.wav

Subtle scanner pulse.

### hard_level.wav

Deep mechanical pulse.

Create:

```text
src/utils/sounds.js
```

The sound manager must:

1. Preload all sounds.
2. Play sound by key.
3. Respect mute setting.
4. Respect reduced-intensity setting.
5. Avoid overlapping sounds badly.
6. Stop or fade previous sounds where needed.
7. Fail gracefully if a sound file is missing.
8. Never crash the game because of audio.
9. Keep the retry loop fast.

Settings must include:

1. Sound: on/off.
2. Haptics: on/off.
3. Intensity: normal / reduced.

Default:

1. Sound on.
2. Haptics on.
3. Intensity normal.

Reduced-intensity mode must:

1. Lower sound volume.
2. Disable orbit pulse.
3. Soften fail sound.
4. Keep tap, success, and level complete.
5. Keep the game playable quietly.

Create:

```text
docs/audio_licences.md
```

This document must list every sound file with:

1. File name.
2. Source URL.
3. Creator name if available.
4. Licence type.
5. Commercial-use status.
6. Attribution requirement.
7. Date downloaded.
8. Any required attribution text.

## Sound completion requirement

The sound task is not complete unless:

1. All required sound files exist in `src/assets/sounds/`.
2. `sounds.js` can load them.
3. GameScreen uses tap, fail, near miss, success, and level complete sounds.
4. Daily challenge uses `daily_open.wav`.
5. Challenge received uses `challenge_ping.wav`.
6. Share card generation uses `share_ready.wav`.
7. Hard level unlock uses `hard_level.wav`.
8. Orbit pulse uses `orbit_pulse.wav` or is disabled in reduced-intensity mode.
9. Mute setting works.
10. Reduced-intensity mode works.
11. `docs/audio_licences.md` exists.
12. No sound has unclear commercial-use rights.
13. The app still works if audio loading fails.

If safe direct download is impossible:

1. Generate a clear sound-asset acquisition checklist.
2. Create the required integration structure.
3. Leave the game functional without crashing.
4. Mark the asset task as blocked by manual acquisition in `BUILD_PROGRESS.md`.
5. Do not falsely mark the audio phase complete.

Preferred outcome: source, install, document, and integrate the sounds.

---

# 6. Viral Loop

The viral loop is:

1. Player fails repeatedly.
2. Attempt counter climbs.
3. Near-miss messages create frustration.
4. Player finally wins.
5. Game generates a futuristic share card.
6. Player shares the score.
7. Friend opens the link.
8. Friend tries the same level.
9. Friend shares their result.
10. Loop repeats.

The core viral object is the attempt count.

Core share message:

```text
“I spent 47 attempts on Level 7 in Secundas. Think you can do better?”
```

The visual viral object is the share card.

The share card must feel like a trophy, not an advert.

---

# 7. Clean Architecture

Framework:

```text
React Native + Expo using EAS Build
```

Use EAS Development Builds and EAS production builds.

Do not rely on Expo Go as the final/full test environment because RevenueCat, deep links, native build configuration, and release behaviour require proper builds.

Backend:

```text
Supabase optional sync layer
```

The game must work fully offline.

Supabase enhances:

- leaderboards;
- synced challenges;
- statistics;
- global averages.

It must never be required for gameplay.

Payments:

```text
RevenueCat
```

No ads in version 1.

Push:

```text
Local scheduled notifications only
```

No Firebase Cloud Messaging.

Deep links:

```text
Universal links with web fallback
```

Local storage:

```text
AsyncStorage
```

Static website:

- Cloudflare Pages;
- GitHub Pages;
- Netlify free tier;

or equivalent low-cost static hosting.

---

# 8. Zero-Cost Operating Model

The game must launch with no fixed monthly server cost where practical.

Required cost:

- Google Play Developer account: one-time fee.

Optional cost:

- domain name.

Free or near-free services may include:

1. Supabase free tier for optional sync.
2. RevenueCat free/usage-based tier as applicable.
3. Cloudflare Pages free static hosting.
4. GitHub free repository.
5. Expo/EAS free build allowance for early builds.

Pricing and free-tier limits change over time.

Do not hard-code old third-party pricing assumptions into game logic.

Before production commercial decisions, re-check current provider pricing.

The app must not break if:

- Supabase is down;
- Supabase is unavailable;
- Supabase free limits are exceeded;
- RevenueCat is temporarily unreachable;
- static fallback hosting is unavailable.

---

# 9. Key Corrections Applied

This specification deliberately uses these rules:

1. No ads in v1.
2. No AdMob.
3. No ad-frequency constant.
4. No claim that the app needs literally no network-related capability.
5. No invasive permissions.
6. No claim that no data is ever uploaded if Supabase sync is enabled.
7. Supabase is optional and offline-first.
8. Local gameplay never depends on Supabase.
9. EAS Development Build is required for realistic native testing.
10. Universal links require web fallback and Android asset links.
11. Notifications are local scheduled notifications only.
12. RevenueCat is the only monetisation system.
13. Gameplay is never paywalled.
14. Purchases are cosmetic or pro-stat features only.
15. Visual design must be futuristic and premium.
16. Sound design must be intense, futuristic, and fully installed before launch.
17. Safe-zone reduction after Level 4 is linear 4-percentage-point subtraction.
18. Every valid stop tap counts once.
19. Near miss shows `FAIL` and `SO CLOSE!`.
20. The final user-facing product name is Secundas.

---

# 10. Required App Behaviour

The game must:

1. Launch into a clean futuristic Home screen.
2. Let the player start standard levels.
3. Let the player start the Daily Challenge.
4. Track attempts per level.
5. Track total attempts.
6. Track Daily Challenge attempts.
7. Track completion status.
8. Track streaks.
9. Generate futuristic share cards.
10. Create friend challenge links.
11. Accept incoming challenge links.
12. Work offline.
13. Sync to Supabase only when available.
14. Never block gameplay behind payment.
15. Support IAP through RevenueCat.
16. Support restore purchases.
17. Support local notifications.
18. Support deep links and universal links.
19. Include intense futuristic sound effects.
20. Include mute and reduced-intensity mode.
21. Build into a production Android AAB.

---

# 11. Tech Stack

Use:

1. React Native.
2. Expo.
3. EAS Build.
4. JavaScript.
5. React Navigation.
6. AsyncStorage.
7. Expo Haptics.
8. Expo Linking.
9. Expo Sharing.
10. Expo Notifications.
11. Expo Clipboard.
12. Expo Updates.
13. Expo AV or the current Expo-supported audio implementation if SDK migration requires it.
14. Supabase JS client.
15. RevenueCat React Native SDK.
16. React Native View Shot.
17. React Native SVG.
18. Cloudflare Pages or equivalent static host for web fallback.

Do not use:

1. Unity.
2. Godot.
3. Native Android code unless absolutely required.
4. AdMob.
5. Firebase.
6. Custom backend.
7. Complex physics engine.
8. Server-side game logic.
9. Mandatory accounts.
10. Invasive permissions.
11. Generic flat app UI.
12. Copyrighted sound assets.
13. Background music loops in v1.

---

# 12. File Structure

Target structure:

```text
secundas/
├── App.js
├── BUILD.md
├── BUILD_PROGRESS.md
├── README.md
├── package.json
├── app.json
├── eas.json
├── .gitignore
├── SECUNDAS_BUILD_SPEC.md
├── docs/
│   ├── audio_licences.md
│   └── secundas-visual-reference.png
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── GameScreen.js
│   │   ├── ChallengeScreen.js
│   │   └── SettingsScreen.js
│   ├── components/
│   │   ├── SafeZone.js
│   │   ├── Indicator.js
│   │   ├── AttemptCounter.js
│   │   ├── ShareCard.js
│   │   ├── DeathModal.js
│   │   ├── SuccessModal.js
│   │   └── DailyTimer.js
│   ├── game/
│   │   ├── levelEngine.js
│   │   ├── dailySeed.js
│   │   ├── replayRecorder.js
│   │   └── scoring.js
│   ├── services/
│   │   ├── supabase.js
│   │   ├── revenuecat.js
│   │   ├── notifications.js
│   │   └── deepLinks.js
│   ├── utils/
│   │   ├── haptics.js
│   │   ├── sounds.js
│   │   ├── storage.js
│   │   ├── constants.js
│   │   └── formatters.js
│   └── assets/
│       ├── sounds/
│       │   ├── tap.wav
│       │   ├── success.wav
│       │   ├── fail.wav
│       │   ├── near_miss.wav
│       │   ├── level_complete.wav
│       │   ├── daily_open.wav
│       │   ├── challenge_ping.wav
│       │   ├── share_ready.wav
│       │   ├── orbit_pulse.wav
│       │   └── hard_level.wav
│       └── generated/
├── supabase/
│   └── schema.sql
└── web/
    ├── index.html
    └── .well-known/
        └── assetlinks.json
```

The existing repository structure is authoritative where already implemented and working.

Do not perform needless renames merely to match this tree if the current structure is functionally equivalent.

---

# 13. Dependencies

Initial dependency intent:

```text
React Native / Expo
React Navigation
AsyncStorage
Expo Haptics
Expo Linking
Expo Sharing
Expo Notifications
Expo Clipboard
Expo Updates
audio implementation
Supabase JS
RevenueCat
react-native-view-shot
react-native-svg
```

Navigation currently uses the stack navigator.

Gesture-handler setup must remain correct.

Do not blindly reinstall dependencies that already exist.

Before modifying packages, inspect `package.json` and the current Expo SDK compatibility.

Do not use destructive dependency upgrades merely because a newer package exists.

---

# 14. App Configuration

Final configuration intent:

```json
{
  "expo": {
    "name": "Secundas",
    "slug": "secundas",
    "version": "1.0.0",
    "orientation": "portrait",
    "scheme": "secundas",
    "userInterfaceStyle": "dark",
    "updates": {
      "enabled": true
    },
    "android": {
      "package": "com.secundas.game",
      "versionCode": 1,
      "permissions": []
    }
  }
}
```

Do not request invasive permissions.

The app may use internet connectivity for:

1. Supabase optional sync.
2. RevenueCat purchase checks.
3. Universal-link fallback.
4. External share links.

The app must not request:

1. Camera.
2. Microphone.
3. Contacts.
4. SMS.
5. Location.
6. Broad file access.
7. Screen recording.
8. Notification-listener access.
9. Accessibility service access.
10. Usage access.

This game does not need device-monitoring permissions.

---

# 15. Constants

Create/use:

```text
src/utils/constants.js
```

Include:

```js
export const COLORS = {
  background: '#050507',
  panel: '#0D0D12',
  glass: 'rgba(255,255,255,0.06)',
  text: '#F5F7FA',
  muted: '#7A7F8C',
  accent: '#FF2D55',
  safe: '#00FF88',
  electric: '#00D1FF',
  warning: '#FF9F0A',
  danger: '#3A0710',
  fail: '#FF0044',
  success: '#00FF88'
};

export const LEVEL_THRESHOLDS = {
  easy: [1, 3],
  medium: [4, 10],
  hard: [11, 25],
  impossible: [26, Infinity]
};

export const MONETISATION = {
  adsEnabled: false,
  iapOnly: true
};

export const PRODUCT_IDS = {
  proMode: 'pro_mode',
  unlockSkins: 'unlock_skins',
  lifetime: 'lifetime'
};

export const VISUALS = {
  neonGlowEnabled: true,
  motionTrailEnabled: true,
  scanlineEnabled: true,
  cyberHudEnabled: true
};

export const SOUND_KEYS = {
  tap: 'tap',
  success: 'success',
  fail: 'fail',
  nearMiss: 'near_miss',
  levelComplete: 'level_complete',
  dailyOpen: 'daily_open',
  challengePing: 'challenge_ping',
  shareReady: 'share_ready',
  orbitPulse: 'orbit_pulse',
  hardLevel: 'hard_level'
};
```

No ad-frequency constants.

No AdMob config.

---

# 16. Core Game Mechanic

Build/use:

```text
src/screens/GameScreen.js
```

The mechanic:

1. Circular orbit appears in centre screen.
2. Safe zone is an arc on that circle.
3. Dot orbits around the circle.
4. Player taps anywhere on the gameplay surface to stop the dot.
5. If dot angle is inside safe arc, success.
6. If dot angle is outside safe arc, fail.
7. Every valid stop tap increments attempt count exactly once.
8. Failure immediately records that attempt.
9. Success records the successful attempt and advances through the success flow.
10. Difficulty is procedural.
11. No external level files are required.

Technical rules:

1. Use React Native Animated API.
2. Use PanResponder for tap detection in the current architecture.
3. Use sin/cos to calculate dot position.
4. Use `react-native-svg` for circle and safe arc.
5. Store attempt data immediately once persistence phase is active.
6. Game must not depend on internet.
7. Haptics fire on success, fail, and near miss once Phase 14 is active.
8. Sounds fire on tap, success, fail, near miss, and level complete once sound phases are active.
9. Sounds can be muted.
10. Sound intensity can be reduced.
11. App must keep gameplay smooth.

Visual rules:

1. Orbit ring must be neon and glowing.
2. Safe arc must glow green.
3. Danger arc must pulse red on failure.
4. Dot must be white or electric blue with subtle glow.
5. Dot should have a subtle motion trail.
6. Arena must feel like a futuristic reflex test.
7. Background must be dark with subtle grid/noise/scanline texture.
8. Level number should appear as faint background watermark.

Audio rules once audio phases are implemented:

1. Tap sound plays instantly on tap.
2. Fail sound plays instantly after fail detection.
3. Near-miss sound replaces normal fail sound.
4. Success sound plays instantly after success detection.
5. Level-complete sound plays when Success Modal appears.
6. No sound should block fast retry.

---

# 17. Difficulty Rules

## Levels 1 to 3

1. Tutorial levels.
2. Safe zone is 80% of circle.
3. Ball/orbit speed begins at the fast Level 1 baseline of 0.5x.
4. Show gentle guidance.

Tutorial guidance:

```text
STOP INSIDE THE GREEN SAFE ZONE
```

After Level 3 / entering the real game, display:

```text
NOW THE REAL GAME BEGINS
```

## Level 4

1. Safe zone drops to 45%.
2. Speed becomes 1.0x.
3. Play `hard_level.wav` when the sound phase is active.

## After Level 4

Safe-zone reduction is locked as **4 percentage points per level**:

```text
L4 45%
L5 41%
L6 37%
L7 33%
```

Formula:

```text
0.45 - (0.04 × levelsAfterFour)
```

Do not multiply the prior level by `0.96`.

1. Safe zone has minimum size equivalent of 30 px.
2. Ball/orbit speed increases in discrete five-level tiers.
3. Levels 1–5 use the starting speed tier.
4. Levels 6–10 use the next speed tier.
5. Levels 11–15 increase again, continuing every five levels.
6. Initial tier growth is 20% compounded per five-level tier and may be tuned through runtime playtesting.

The accepted speed-growth implementation may compound by level.

## Level 10+

## Moving Safe Zone

The green safe zone rotates continuously anti-clockwise from Level 1.

Its rotation speed increases in discrete five-level tiers:

- Levels 1–5: starting rotation tier.
- Levels 6–10: faster rotation.
- Levels 11–15: faster again.
- Continue increasing every five levels.

Initial safe-zone rotation growth is 20% compounded per five-level tier and may be tuned through runtime playtesting.

At high levels, both the orbiting ball and the green safe zone move at high speed simultaneously. The player must time the intersection of two moving targets with a single tap.

The existing safe-zone shrink curve and 30 px minimum safe-arc floor remain unchanged.

## Level 25+

1. Speed pulsing starts.
2. Speed varies by ±15%.

## Near miss

If the tap is within 12 px of a safe-zone edge:

```text
FAIL
SO CLOSE!
```

Trigger:

- near-miss haptic once haptics exist;
- `near_miss.wav` once audio exists.

---

# 18. Game Display

Game screen layout:

## Top

1. LEVEL number.
2. Attempt counter / attempt HUD.
3. Short flavour phrase where appropriate.

## Center

1. Neon circular orbit.
2. Green glowing safe arc.
3. Dark-red/red danger zone.
4. White or electric-blue glowing dot.
5. Subtle motion trail.
6. Radial glow behind arena.
7. Faint radial/circular targeting grid.
8. Faint level-number background watermark.

## Bottom

1. Hint text.
2. Target score if challenge mode.
3. Mute toggle.
4. Exit button.

Locked instruction:

```text
TAP TO STOP
HIT THE SAFE ZONE
```

Visual style:

1. Background: `#050507`.
2. Panel: `#0D0D12`.
3. Glass UI: `rgba(255,255,255,0.06)`.
4. Safe zone: `#00FF88`.
5. Dot: `#F5F7FA` or `#00D1FF`.
6. Danger zone: `#3A0710`.
7. Failure accent: `#FF0044`.
8. Main accent: `#FF2D55`.
9. Large clean futuristic typography.
10. No clutter.

---

# 19. Attempt Counter

Build/use:

```text
src/components/AttemptCounter.js
```

Requirements:

1. Large number showing attempts on current level.
2. Futuristic scoreboard styling.
3. Updates instantly for every valid attempt.
4. No delayed update.
5. Slot-machine, glitch-bounce, or similarly sharp micro-animation.
6. Neon glow behind high attempt counts.
7. Supporting label may show level context.
8. World-average line appears below.

World-average display:

When available:

```text
WORLD AVG: 23
```

Data order:

1. Local cache first.
2. Supabase if available.
3. If unavailable:

```text
WORLD AVG UNAVAILABLE
```

Never fabricate a world average.

## Colour thresholds

1. 1–9: white.
2. 10–49: gold.
3. 50–99: orange.
4. 100–199: red.
5. 200+: pulsing hot red.

The screenshot does not override these thresholds.

Sound relation once audio exists:

1. Counter update syncs visually with fail/near-miss response.
2. Counter update must not lag behind sound.

---

# 20. Death Modal

Build/use:

```text
src/components/DeathModal.js
```

Appears on fail.

Behaviour:

1. Shows immediately on fail.
2. Auto-dismisses in 1.5 seconds.
3. User can tap to dismiss.
4. Does not block retry for long.
5. Never shows ads.
6. Never shows payment prompt.

Visual style:

1. Sharp black glass panel.
2. Red neon border/accent.
3. Red fail flash behind modal.
4. Glitch-style FAIL text if practical.
5. Brutal but clean.
6. Not cartoonish.

Audio style once audio exists:

1. Fail sound must feel heavy and brutal.
2. Near-miss sound must feel sharper and more frustrating than normal fail.
3. Sound must finish quickly.

Content:

1. Big text:
   ```text
   FAIL
   ```
2. Attempt count.
3. If near miss, additionally:
   ```text
   SO CLOSE!
   ```
4. Random message.

Random messages:

```text
Not even close
You hesitated
Too eager
The dot mocks you
Try tapping... better?
Level X has claimed N victims today
```

The victims-today message must only appear when valid data exists.

After 10 fails:

```text
SHARE YOUR SUFFERING
```

After 25 fails:

```text
CHALLENGE A FRIEND TO SUFFER TOO
```

At Phase 11 these are future integration points.

Actual share-card and challenge-link flows are implemented only in their later phases.

No fake share action.

No fake challenge action.

---

# 21. Success Modal

Build:

```text
src/components/SuccessModal.js
```

On level complete, show:

1. `LEVEL X COMPLETE`.
2. Player attempt count.
3. World average when valid.
4. Emoji pattern grid.
5. Share Victory button.
6. Challenge Friend button.
7. Next Level button.

Example comparison when world average exists:

```text
You: 47 attempts | World avg: 23
```

If world average is unavailable, do not invent one.

Use a truthful unavailable state or omit the numeric comparison while preserving layout.

## Visual style

1. Neon green victory glow.
2. Clean black glass panel.
3. Electric-blue highlight.
4. Brief scanline flash.
5. Futuristic trophy feel.
6. Premium, restrained, uncluttered.

## Audio style

When audio phases are active:

1. Success sound plays instantly.
2. Level-complete sound plays with modal.
3. Sound feels like release and reward.

Do not fake these sounds in Phase 12 before audio integration exists.

## Auto-advance

1. Next level auto-starts after 3 seconds.
2. User can tap Next Level immediately.
3. Manual Next Level must cancel/prevent duplicate auto-advance.

## Special cases

Exactly 1 attempt:

```text
FLAWLESS
```

100+ attempts:

```text
PERSISTENCE
```

## Attempt pattern

1. 🟥 = fail.
2. 🟩 = success.
3. Maximum 20 emojis.
4. Add `...` if longer than 20.

## Phase boundary

Phase 12 builds the Success Modal and clean future integration points.

It must not falsely implement sharing/challenges before the dedicated phases.

---

# 22. Local Storage Format

Use AsyncStorage through:

```text
src/utils/storage.js
```

Store data in this shape or a compatible versioned evolution:

```js
{
  levels: {
    level_1: {
      attempts: 6,
      completed: true,
      pattern: ['fail', 'fail', 'success'],
      fastestMs: 2300,
      bestAttempts: 3,
      synced: false
    }
  },
  totalAttempts: 120,
  completedLevels: 12,
  dailyHistory: [],
  challenges: {},
  purchases: {},
  settings: {
    muted: false,
    haptics: true,
    soundIntensity: 'normal',
    visualEffects: true
  }
}
```

Rules:

1. Save immediately after every attempt.
2. Never wait for Supabase.
3. Never lose local progress merely because the device is offline.
4. Sync flags are only for optional Supabase uploads.
5. Visual effects can be reduced if performance is poor.
6. Sound settings must persist.
7. Current level/continue state must persist.
8. Challenge history must persist when implemented.
9. Cached world averages must be safely stored when implemented.

---

# 23. Share Cards

Build:

```text
src/components/ShareCard.js
```

This is the viral engine.

Conceptual function:

```text
generateShareCard(levelNumber, attempts, pattern, type)
```

Types:

1. fail.
2. success.
3. challenge.
4. daily.

Share cards must look like futuristic achievement trophies.

Design:

1. Black glass background.
2. Neon border.
3. Huge attempt number.
4. Thin grid texture.
5. Subtle glow.
6. SECUNDAS title at top.
7. Challenge URL at bottom where relevant.
8. No cheap advert look.
9. No oversized logo dominating the result.
10. No “Download now”.
11. No spammy CTA.

Card-copy examples:

```text
47 ATTEMPTS
LEVEL 7 SURVIVED
```

```text
LEVEL 7 BROKE ME
47 ATTEMPTS
CAN YOU DO BETTER?
```

Standard layout:

1. Dark background.
2. Top: `SECUNDAS`.
3. Center: massive attempt number.
4. Below:
   ```text
   ATTEMPTS ON LEVEL X
   ```
   or:
   ```text
   TO BEAT LEVEL X
   ```
5. Emoji pattern grid.
6. If fail:
   ```text
   CAN YOU DO BETTER?
   ```
7. If success:
   ```text
   I DID IT. YOUR TURN.
   ```
8. Bottom:
   ```text
   secundas.app
   ```
9. Small text:
   ```text
   TAP TO PLAY
   ```

Technical:

1. Use `react-native-view-shot`.
2. Render card off-screen.
3. Capture as PNG.
4. Share with Expo Sharing.
5. Include image, text, and deep link.
6. Copy link to clipboard when possible.
7. Clean temp image after sharing.
8. Must work offline.
9. Uses local AsyncStorage data.
10. Play `share_ready.wav` when audio integration exists.

Share text:

```text
I spent {N} attempts on Level {X} in Secundas. Think you can do better? {link}
```

Fallback URL:

```text
https://secundas.app/c/{level}/{attempts}/{seed}
```

---

# 24. Challenge System

Build universal-link challenge system.

Deep link:

```text
https://secundas.app/c/{level}/{score}/{seed}
```

App-scheme fallback:

```text
secundas://challenge?level={level}&score={score}&seed={seed}
```

The app should also safely support the canonical challenge path format used by the deep-link parser.

## Challenge creation

1. On level complete, show `Challenge Friend`.
2. Generate URL with level, score, and seed.
3. Use native share sheet.
4. Store challenge locally.

Local challenge object:

```js
{
  challengeId: 'local-id',
  level: 7,
  score: 47,
  seed: 'abc123',
  timestamp: 123456,
  status: 'sent'
}
```

## Challenge reception

1. Parse incoming link using Expo Linking.
2. Extract level, score, and seed.
3. Open ChallengeScreen.
4. Play `challenge_ping.wav` once audio exists.
5. Display:

```text
Someone beat Level 7 in 47 tries.
```

6. Display:

```text
Can you beat them?
```

7. Accept Challenge starts GameScreen with same level and seed.
8. Show target banner:

```text
BEAT 47 ATTEMPTS
```

## After completion

If player beats score:

```text
YOU WIN
```

If not:

```text
THEY GOT YOU
```

Then:

1. Show comparison.
2. Generate return challenge link.

Core challenge flow must work without Supabase.

Supabase challenge sync is optional.

Challenge UI must follow futuristic black-glass/neon style.

---

# 25. Universal-Link Web Fallback

Create:

```text
web/index.html
```

It must:

1. Display Secundas landing page.
2. Use futuristic dark/neon styling.
3. Try to open the app via app scheme.
4. Fall back to Play Store after delay.
5. Preserve challenge path.
6. Have Open Graph metadata for sharing.

Create:

```text
web/.well-known/assetlinks.json
```

Purpose:

Android App Links verification.

Template:

```json
[
  {
    "relation": [
      "delegate_permission/common.handle_all_urls"
    ],
    "target": {
      "namespace": "android_app",
      "package_name": "com.secundas.game",
      "sha256_cert_fingerprints": [
        "REPLACE_WITH_RELEASE_CERT_SHA256"
      ]
    }
  }
]
```

Setup documentation must explain how to replace the SHA-256 fingerprint after the signing key/certificate is known.

---

# 26. Daily Challenge

Build Daily Challenge system.

Daily seed:

```text
YYYY-MM-DD
```

Same seed means same generated challenge logic for that day.

Default:

1. Generated at local midnight.
2. Stored locally once generated.
3. Does not require internet.

Daily Challenge screen/home card:

1. `DAILY CHALLENGE - <date>`.
2. Attempt count if tried.
3. Cached global struggle stat if Supabase available.
4. Timer to next challenge.
5. Yesterday’s local result.
6. Daily streak.

Visual style:

1. Futuristic challenge card.
2. Neon pink/red accent.
3. Countdown in electric blue.
4. Streak in warning orange.
5. Clean black glass panel.

Audio:

1. Play `daily_open.wav` when Daily Challenge starts after sound integration.
2. Do not loop Daily Challenge audio.

Local daily stats:

```js
dailyHistory: [
  {
    date: '2026-06-01',
    completed: true,
    attempts: 33,
    seed: '2026-06-01'
  }
]
```

Local notifications:

At local midnight:

```text
New daily challenge is live! 🔥
```

At 8 PM if not completed:

```text
Still time for today’s challenge.
```

No server push.

No Firebase.

No Expo push-server requirement.

---

# 27. Monetisation

Use RevenueCat.

No ads in v1.

Purchases:

1. Pro Mode — product ID:
   ```text
   pro_mode
   ```
2. Unlock Skins — product ID:
   ```text
   unlock_skins
   ```
3. Lifetime — product ID:
   ```text
   lifetime
   ```

Original intended launch prices:

- Pro Mode: $0.99 one-time.
- Unlock Skins: $0.99 one-time.
- Lifetime: $2.99 one-time.

Store pricing may be configured/localised through Google Play/RevenueCat and should be rechecked before production.

Gameplay rules:

1. Never block gameplay behind paywall.
2. Never show purchase prompt during first 10 levels.
3. Never show purchase prompt on death screen.
4. Never interrupt fast retry loop.
5. Never use dark patterns.

Pro features:

1. Detailed per-level statistics.
2. Unlimited replays.
3. Custom dot colours.
4. Remove “Get Pro” prompts.
5. Gold name in leaderboard when Supabase enabled.
6. Early access label if later added.

Skins:

1. Gold dot.
2. Fire dot.
3. Ghost dot.
4. Neon dot.
5. Ice dot.
6. Shadow dot.
7. Classic dot.
8. Pulse dot.
9. Retro dot.
10. Void dot.

RevenueCat implementation:

1. Initialise on app mount.
2. Load offerings.
3. Check purchaser info on app launch.
4. Cache entitlement status locally.
5. Restore purchases from Settings.
6. Fail gracefully if RevenueCat unreachable.
7. Game still works offline.

Monetisation UI must match the futuristic visual style.

No generic app-store-looking paywall.

---

# 28. Supabase Optional Sync

Build:

```text
src/services/supabase.js
```

Supabase must be optional.

The game must work fully offline.

Supabase enhances:

1. Daily leaderboard.
2. Per-level leaderboard.
3. Global averages.
4. Challenge sync.
5. Anonymous profile stats.

Supabase must never be required for:

1. Starting the game.
2. Playing levels.
3. Completing levels.
4. Daily Challenge.
5. Local challenge link.
6. Local stats.
7. Local share cards.

On app open when configured:

1. Try connecting to Supabase.
2. If connected, sign in anonymously.
3. Store anonymous user ID locally.
4. Upload unsynced attempts.
5. Fetch leaderboard/world-average cache.
6. If failed, continue offline silently.

Do not block UI waiting for network.

---

# 29. Supabase Schema

Create:

```text
supabase/schema.sql
```

Schema:

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT,
  total_attempts INTEGER DEFAULT 0,
  levels_completed INTEGER DEFAULT 0,
  pro_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.attempts (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  level_number INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  pattern JSONB,
  time_to_complete_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.challenges (
  id BIGSERIAL PRIMARY KEY,
  challenger_id UUID REFERENCES auth.users NOT NULL,
  challenged_id UUID REFERENCES auth.users,
  level INTEGER NOT NULL,
  seed TEXT,
  challenger_score INTEGER NOT NULL,
  challenged_score INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.daily_scores (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  level_completed INTEGER NOT NULL,
  attempts INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read all profiles"
ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own attempts"
ON public.attempts
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read all attempts"
ON public.attempts
FOR SELECT USING (true);

CREATE POLICY "Users can create challenges"
ON public.challenges
FOR INSERT WITH CHECK (auth.uid() = challenger_id);

CREATE POLICY "Users can read relevant challenges"
ON public.challenges
FOR SELECT USING (
  auth.uid() = challenger_id
  OR auth.uid() = challenged_id
  OR challenged_id IS NULL
);

CREATE POLICY "Users can update relevant challenges"
ON public.challenges
FOR UPDATE USING (
  auth.uid() = challenger_id
  OR auth.uid() = challenged_id
);

CREATE POLICY "Anyone can read daily scores"
ON public.daily_scores
FOR SELECT USING (true);

CREATE POLICY "Users can insert own daily scores"
ON public.daily_scores
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

Setup docs must explain:

1. Create Supabase project.
2. Enable anonymous auth.
3. Run schema.
4. Copy project URL and anon key.
5. Configure them through the project’s environment/config system.
6. If not configured, app still works offline.

Do not hard-code production secrets.

---

# 30. Privacy Rule

The privacy policy must be honest.

If Supabase is disabled:

1. Gameplay data stays on device.
2. No account required.
3. No cloud gameplay sync.
4. Gameplay data leaves the phone only through intentional sharing or other clearly disclosed service interaction.

If Supabase is enabled:

Anonymous gameplay data may sync, including:

1. Anonymous user ID.
2. Level number.
3. Attempt count.
4. Completion status.
5. Daily score.
6. Challenge score.

RevenueCat may process purchase information.

The app must not claim:

```text
“No data leaves the device”
```

when Supabase/RevenueCat functionality is enabled.

Correct wording:

```text
“Core gameplay works locally. If online leaderboard or challenge sync is enabled, anonymous gameplay scores may be uploaded to Supabase.”
```

No invasive personal data collection:

1. No name required.
2. No email required for core gameplay.
3. No contacts.
4. No camera.
5. No microphone.
6. No location.
7. No SMS.
8. No screen access.

---

# 31. Haptics

Use Expo Haptics.

Patterns:

1. Success tap: light impact.
2. Fail tap: heavy impact.
3. Near miss: two quick light impacts.
4. Level complete: success notification pattern.
5. Streak milestone: suitable milestone pattern.

Respect:

```js
settings.haptics === false
```

Reduced-intensity mode should soften haptic aggression where appropriate.

---

# 32. Sounds

Use the project’s Expo-compatible audio implementation.

Use installed files from:

```text
src/assets/sounds/
```

Required game audio events:

1. Tap = `tap.wav`.
2. Success = `success.wav`.
3. Fail = `fail.wav`.
4. Near miss = `near_miss.wav`.
5. Level complete = `level_complete.wav`.
6. Daily open = `daily_open.wav`.
7. Challenge received = `challenge_ping.wav`.
8. Share ready = `share_ready.wav`.
9. Orbit pulse = `orbit_pulse.wav`.
10. Hard-level unlock = `hard_level.wav`.

Mute toggle:

1. Visible on Game screen.
2. Available in Settings.
3. Persisted in AsyncStorage.
4. Respected globally.

Reduced-intensity mode:

1. Available in Settings.
2. Persisted in AsyncStorage.
3. Lowers volume.
4. Disables orbit pulse.
5. Softens fail sound.
6. Keeps core input sounds.

If audio fails:

1. Game continues.
2. Error is handled safely.
3. No crash.
4. Haptics still work if enabled.

No copyrighted audio.

No long music.

No background music in v1.

---

# 33. Animations

Add/retain:

1. Dot pulse animation.
2. Dot motion trail.
3. Safe-zone neon glow.
4. Danger-zone red pulse.
5. Level-complete flash.
6. Attempt-counter glitch/bounce.
7. Death-modal slide up.
8. Share-card fade in.
9. Milestone badge animation.
10. Faint level-number background watermark.
11. Subtle scanline transition.
12. Challenge-accepted electric pulse.

Keep performance smooth.

No heavy particle systems.

---

# 34. Futuristic Background System

Add/use a lightweight futuristic background system.

Requirements:

1. Dark near-black background.
2. Subtle grid lines or circular targeting lines.
3. Subtle noise or scanline overlay.
4. Slow radial glow behind orbit arena.
5. Must not distract from gameplay.
6. Must not harm performance.
7. Can be reduced/disabled if `visualEffects` is false.

Do not use heavy animated particles.

Do not use external copyrighted image assets.

---

# 35. Home Screen

HomeScreen must show:

1. Game title.
2. Tagline / brand treatment.
3. Start button.
4. Continue Level button.
5. Daily Challenge card.
6. Daily timer.
7. Current streak.
8. Total attempts.
9. Levels completed.
10. Challenge inbox badge.
11. Settings button.
12. Pro status if purchased.

Visual style:

1. Futuristic black glass panels.
2. Neon accent buttons.
3. Huge title.
4. Tagline in muted grey where used.
5. Daily Challenge card with electric-blue countdown.
6. Attempt stats in scoreboard style.
7. Eclipse/orbit wordmark treatment from the locked reference.
8. START red/accent.
9. CONTINUE LEVEL electric-blue outlined.
10. Stats displayed as icon → label → number.

Daily card:

1. Shows today’s seed/date where appropriate.
2. Shows whether attempted.
3. Shows attempts if played.
4. Shows countdown to next daily.
5. Starts Daily Challenge.
6. Plays `daily_open.wav` once sound integration exists.

---

# 36. Settings Screen

Settings must include:

1. Mute toggle.
2. Sound on/off.
3. Sound intensity normal/reduced.
4. Haptics toggle.
5. Visual effects toggle.
6. Restore purchases.
7. Get Pro / Lifetime unlock.
8. Dot skin selection.
9. Reset local progress.
10. Privacy policy.
11. Terms.
12. Audio licences.
13. Supabase sync status.
14. RevenueCat status.
15. App version.

Reset progress must require confirmation.

Settings UI must match futuristic black-glass style.

---

# 37. Challenge Screen

ChallengeScreen must include:

1. Incoming challenge view from deep link.
2. Sent challenge history.
3. Accepted challenge history.
4. Completed challenge history.
5. Accept Challenge button.
6. Challenge result comparison.
7. Challenge back button.
8. Share-link button.

Everything must work locally.

Supabase sync is optional.

Visual style:

1. Black glass cards.
2. Pink/red challenge accents.
3. Electric-blue target score.
4. Futuristic comparison layout.

Audio:

1. Play `challenge_ping.wav` on incoming challenge once.
2. Do not repeat the ping constantly.

---

# 38. Daily Timer

Build:

```text
src/components/DailyTimer.js
```

Requirements:

1. Count down to next local midnight.
2. Update every second while visible.
3. Avoid memory leaks.
4. Pause/clean timer on unmount.
5. Format:

```text
14:32:17
```

Style:

1. Electric-blue text.
2. Digital-clock feel.
3. Wide letter spacing.

---

# 39. Replay Recorder

Build:

```text
src/game/replayRecorder.js
```

Minimum v1:

1. Record dot angle at tap.
2. Record success/fail.
3. Record timestamp.
4. Store fastest successful run.
5. Pro users can view replay summary.

Do not build complex video replay unless intentionally added later.

No screen recording.

No heavy storage.

---

# 40. Deployment

Prepare EAS.

`eas.json` must include:

1. development profile.
2. preview profile.
3. production profile.

Production build command:

```text
eas build --platform android --profile production
```

Also ensure normal development commands work.

If automated tests exist:

```text
npm test
```

AAB output must be ready for Play Store upload.

---

# 41. Required Commands

The project must support the appropriate current commands, including:

```text
npm install
npx expo start
eas build --platform android --profile development
eas build --platform android --profile production
```

Current local build/export verification may include:

```text
npx expo export --platform android --clear
```

If tests are configured:

```text
npm test
```

Document every working command in README.

---

# 42. Play Store Listing

App name:

```text
Secundas
```

Short description:

```text
One tap. One second. Endless rage. How many attempts will you need?
```

Full-description intent:

```text
Secundas is a brutal futuristic one-tap timing game that looks easy until it breaks you.

Stop the moving indicator inside the neon safe zone. Miss by a hair and try again. Every level gets faster, tighter, and more ridiculous.

Beat levels. Count your attempts. Challenge friends. Share your suffering.
```

Features:

- One-tap gameplay
- Futuristic neon timing arena
- Intense cyber sound effects
- Brutal procedural levels
- Daily Challenge
- Friend challenge links
- Shareable score cards
- Attempt counter
- Near-miss moments
- Haptics and sound
- Offline gameplay
- Optional leaderboards
- No ads in version 1

Closing hook:

```text
Can you beat Level 7 in fewer than 47 attempts?

One tap. One second. Endless rage.
```

The final listing must only claim features actually shipping.

---

# 43. Store Assets

Create simple placeholder assets that can be replaced by final production artwork where necessary:

1. Futuristic app icon.
2. Dark neon splash screen.
3. Feature graphic brief.
4. Screenshot guide.
5. Share-card examples.

Feature graphic text:

```text
One tap. One second. Endless rage.
```

Screenshot concepts:

1. Neon gameplay arena with attempt counter showing an illustrative high attempt count.
2. Death Modal showing:
   ```text
   FAIL
   SO CLOSE!
   ```
3. Futuristic share-card example.
4. Daily Challenge card.
5. Challenge Friend screen.

Final production assets should match the locked Secundas visual reference.

---

# 44. Privacy Policy

Create privacy policy page.

Must state:

1. Core gameplay works locally.
2. Local progress is stored on device.
3. Supabase sync is optional.
4. If online sync is enabled, anonymous gameplay scores may be uploaded.
5. RevenueCat handles purchase status where enabled.
6. No camera.
7. No microphone.
8. No contacts.
9. No location.
10. No SMS.
11. No screen recording.
12. No gameplay paywall.
13. User can reset local progress.
14. Audio assets are bundled locally.
15. No microphone/audio recording is used.

The wording must remain accurate to the actual shipping build.

---

# 45. Web Fallback Page

Create:

```text
web/index.html
```

It must include:

1. Title.
2. Tagline.
3. Futuristic dark/neon visual style.
4. Open-app attempt.
5. Play Store fallback.
6. Challenge URL preservation.
7. Open Graph metadata.

Secundas metadata:

```html
<title>Secundas - One tap. One second. Endless rage.</title>
<meta property="og:title" content="Secundas">
<meta property="og:description" content="Can you beat my score?">
```

App scheme:

```text
secundas://
```

Play Store package target:

```text
com.secundas.game
```

The final fallback URL must use the actual published Play Store URL once available.

---

# 46. Build Rules

Any coding agent working on Secundas must:

1. Build sequentially.
2. Complete one phase before the next.
3. Keep `BUILD_PROGRESS.md` updated if that file is used.
4. Run checks after each major phase.
5. Do not leave placeholders except explicitly user-replaceable store assets or clearly blocked external assets.
6. Do not add ads.
7. Do not add Firebase.
8. Do not add invasive permissions.
9. Do not make Supabase mandatory.
10. Do not make RevenueCat mandatory for gameplay.
11. Do not require internet for gameplay.
12. Do not break offline mode.
13. Do not create a basic-looking flat prototype.
14. Preserve futuristic neon visual identity throughout the app.
15. Source, install, document, and integrate free commercial-use sound assets.
16. Do not use unclear or copyrighted audio assets.
17. Do not mark sound complete until `docs/audio_licences.md` is finished.
18. Read this specification before each implementation phase.
19. Inspect the current repository before producing edits.
20. Do not guess line positions if the current file can be inspected.
21. Do not alter previously locked mechanics without a real design mismatch.
22. Verify the pushed commit before declaring a phase locked.

---

# 47. Build Order

Build in this exact order:

1. Project scaffold.
2. Navigation.
3. Constants.
4. Futuristic design system.
5. Storage wrapper.
6. HomeScreen.
7. GameScreen core mechanic.
8. Neon orbit arena visual layer.
9. Level engine.
10. Attempt counter.
11. Death Modal.
12. Success Modal.
13. Local storage persistence.
14. Haptics.
15. Source, install, and document free commercial-use sound assets.
16. Build sound manager.
17. Integrate intense futuristic sound effects.
18. Add mute and reduced-intensity settings.
19. Daily Challenge seed.
20. Daily Timer.
21. Local notifications.
22. Share-card rendering.
23. Futuristic share-card styling.
24. Share-sheet integration.
25. Deep-link parsing.
26. Challenge creation.
27. Challenge reception.
28. Challenge history.
29. Settings screen.
30. RevenueCat service.
31. Purchase flow.
32. Restore purchase.
33. Pro-features gating.
34. Supabase schema.
35. Supabase optional-sync service.
36. Leaderboard cache.
37. Web fallback page.
38. Android App Link `assetlinks` template.
39. Futuristic app icon and splash placeholder.
40. Play Store listing.
41. Privacy policy.
42. Audio licences document.
43. README.
44. EAS config.
45. Final test checklist.
46. Production build instructions.

Do not reorder this sequence casually.

If a later system needs an early integration point, create the integration point without faking the later functionality.

---

# 48. Testing Checklist

Manual tests:

1. App opens.
2. Home screen loads.
3. Futuristic visual style appears.
4. Game starts.
5. Dot orbits.
6. Neon orbit renders.
7. Safe zone glows.
8. Motion trail appears or degrades cleanly.
9. Tap stops dot.
10. Tap sound plays when audio phase is active.
11. Success detection works.
12. Success sound plays when active.
13. Fail detection works.
14. Fail sound plays when active.
15. Near-miss detection works.
16. Near-miss sound plays instead of normal fail when active.
17. Attempt counter increments exactly once per valid tap.
18. Successful first tap records 1 attempt.
19. Failed tap never records +2.
20. Level 1–3 tutorial difficulty works.
21. Level 4 difficulty spike works.
22. Hard-level sound plays on Level 4 when active.
23. Level 5 safe zone is 41%.
24. Level 6 safe zone is 37%.
25. Level 7 safe zone is 33% unless the 30 px floor intervenes.
26. Level 10 rotation starts.
27. Level 25 speed pulsing starts.
28. Death Modal appears.
29. Near miss shows both FAIL and SO CLOSE.
30. Death Modal auto-dismisses at 1.5 seconds.
31. Success Modal appears.
32. Success Modal shows correct attempt count.
33. 1-attempt success shows FLAWLESS.
34. 100+ success shows PERSISTENCE.
35. Success pattern uses 🟥/🟩.
36. Pattern truncates to max 20 emojis plus `...` if longer.
37. Success auto-advances at 3 seconds.
38. Next Level advances immediately without duplicate navigation.
39. Level-complete sound plays when active.
40. Progress persists after app close.
41. Daily Challenge generates.
42. Daily-open sound plays when active.
43. Daily Timer works.
44. Local notification schedules.
45. Share card generates.
46. Share-ready sound plays when active.
47. Share card looks futuristic and premium.
48. Share sheet opens.
49. Challenge link generates.
50. Incoming challenge link parses.
51. Challenge ping sound plays when active.
52. Challenge comparison works.
53. Offline mode works.
54. Supabase disabled still works.
55. RevenueCat disabled still allows gameplay.
56. Restore-purchase button exists.
57. Mute toggle works.
58. Sound setting works.
59. Reduced intensity works.
60. Haptic toggle works.
61. Visual-effects toggle works.
62. Settings reset-progress flow works with confirmation.
63. `docs/audio_licences.md` exists.
64. All sound files have documented commercial-use status.
65. No ads exist.
66. No Firebase exists.
67. No invasive permissions exist.
68. No old Last Second user-facing branding remains.
69. Production build starts.
70. AAB is generated.

Deep-link test:

```text
npx uri-scheme open "secundas://c/7/47/abc123" --android
```

App-scheme compatibility may also test the query-form challenge route if the parser supports it:

```text
npx uri-scheme open "secundas://challenge?level=7&score=47&seed=abc123" --android
```

Universal-link test after website setup:

```text
npx uri-scheme open "https://secundas.app/c/7/47/abc123" --android
```

---

# 49. Final Launch Checklist

The game is complete only when:

1. Core gameplay works offline.
2. Standard levels work.
3. Daily Challenge works.
4. Attempts save locally.
5. Attempt counter works.
6. Every valid tap counts exactly once.
7. Death Modal works.
8. Success Modal works.
9. Near miss works.
10. Haptics work.
11. Sounds work or degrade cleanly.
12. All required sound files exist.
13. Audio licences are documented.
14. Mute works.
15. Reduced intensity works.
16. Visual identity is futuristic.
17. Neon timing arena works.
18. Motion trail works or degrades cleanly.
19. Futuristic background works or degrades cleanly.
20. Share cards generate.
21. Share cards look premium and futuristic.
22. Share cards open system share sheet.
23. Challenge links generate.
24. Challenge links are parsed.
25. Web fallback page exists.
26. Android `assetlinks` template exists.
27. Local notifications work.
28. RevenueCat integration exists.
29. Purchases fail gracefully if not configured.
30. Restore-purchase button exists.
31. Supabase schema exists.
32. Supabase sync is optional.
33. Game works with no Supabase keys.
34. Privacy policy is honest.
35. Play Store listing exists.
36. No ads exist.
37. No Firebase exists.
38. No invasive permissions exist.
39. EAS production build config exists.
40. AAB build instructions exist.
41. README explains setup.
42. No TODO comments remain for core gameplay.
43. No fake buttons remain.
44. No demo-only logic remains.
45. No old Last Second branding remains in user-facing product surfaces.
46. Final app visually matches the locked Secundas reference.
47. App is ready for Play Store internal testing.

---

# 50. Final Output Expected From the Build Agent

When finished, the build agent must report:

1. What was built.
2. What files were created.
3. What commands were run.
4. What checks passed.
5. What could not be tested without external accounts.
6. How to run locally.
7. How to create EAS Development Build.
8. How to create production AAB.
9. How to configure RevenueCat.
10. How to configure Supabase.
11. How to deploy the web fallback page.
12. How to test deep links.
13. How to upload to Play Store internal testing.
14. Which sound assets were installed.
15. Where sound licences are documented.
16. Which external values still require production replacement, such as domain, Play Store URL, or signing fingerprint.
17. Exact final commit/release version used for acceptance.

Final rule:

> Do not call Secundas finished until it is playable offline, visually futuristic, sonically intense, shareable, challenge-ready, monetisation-ready, production-build-ready, and verified against this specification.

---

# Appendix A — Locked Current Baseline Before Phase 12

At the current build stage, Phases 1–11 have been repaired/audited as the locked baseline before Phase 12.

Locked baseline includes:

- Secundas branding;
- dark Expo configuration;
- `updates.enabled: true`;
- Android package `com.secundas.game`;
- Android permissions `[]`;
- stack navigation;
- gesture-handler initialisation;
- locked palette;
- futuristic theme tokens;
- AsyncStorage wrapper;
- Home-screen Secundas visual shell;
- core orbit mechanic;
- success/fail detection;
- near-miss detection based on 12 px edge distance;
- blue motion trail;
- ghosted level watermark;
- danger-zone fail pulse;
- Level 1–3 tutorial configuration;
- Level 4 45% / 1.0x spike;
- 4-percentage-point safe-zone shrink after Level 4;
- 30 px minimum arc;
- +6% speed growth;
- Level 10 safe-zone rotation;
- Level 25 ±15% speed pulsing;
- attempt counter threshold colours;
- 200+ hot-red pulse;
- truthful world-average unavailable state;
- Death Modal;
- FAIL always visible;
- SO CLOSE shown additionally for near miss;
- 1.5-second Death Modal auto-dismiss;
- failure-message pool;
- suffering/challenge milestone copy;
- exact-once attempt increment logic.

Phase 12 must build on this baseline without regressing it.

---

# Appendix B — Phase 12 Acceptance Contract

Before Phase 12 is locked, verify all of the following:

1. `SuccessModal.js` exists and is wired to actual successful stop logic.
2. Headline is dynamic:
   ```text
   LEVEL X COMPLETE
   ```
3. Successful attempt is included in the attempt count.
4. Exactly one attempt shows:
   ```text
   FLAWLESS
   ```
5. 100+ attempts shows:
   ```text
   PERSISTENCE
   ```
6. Attempt pattern includes the final success.
7. Pattern uses:
   ```text
   🟥 = fail
   🟩 = success
   ```
8. Pattern displays max 20 emojis.
9. Longer history appends:
   ```text
   ...
   ```
10. Player attempt count is shown.
11. World average is shown only if real/cached data exists.
12. No fake world-average number appears.
13. Share Victory button exists as a clean later-phase integration point.
14. Challenge Friend button exists as a clean later-phase integration point.
15. Those buttons do not falsely claim to share/challenge before their phases exist.
16. Next Level works immediately.
17. Auto-advance occurs after 3 seconds.
18. Manual Next Level cannot produce a second delayed advance.
19. Modal uses green victory glow.
20. Modal uses black-glass panel.
21. Modal has electric-blue highlight.
22. Brief scanline/victory flash is present where practical.
23. Modal feels like a futuristic trophy screen.
24. Later audio integration points are clean.
25. No audio implementation is faked early.
26. Android export succeeds.
27. Existing Phases 1–11 still behave correctly.
28. Exact pushed commit is audited before Phase 12 is called locked.

---

# Appendix C — Brand-Copy Pool

Approved brand voice examples:

```text
TIMING BUILDS CHARACTER
SMALL WINDOWS, BIG EMOTIONS
A GAME FOR PEOPLE WHO CAN'T LET GO
DISCIPLINE IN SECONDS
SAME SECOND, DIFFERENT YOU
A SMALL MOMENT, A BIGGER YOU
TIMING IS EVERYTHING
```

Any additional copy must preserve the same concise, premium, slightly brutal tone.

Do not fill the UI with copy merely because the pool exists.

---

# Appendix D — Visual Reference Placement

Store the locked visual reference in the repository as:

```text
docs/secundas-visual-reference.png
```

At the beginning of every visual implementation/audit:

1. Read this specification.
2. Inspect `docs/secundas-visual-reference.png`.
3. Inspect the current implementation.
4. Compare only the relevant current-phase details.
5. Preserve dynamic gameplay logic even where the reference image shows illustrative static values.

