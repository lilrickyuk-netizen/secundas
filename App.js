import {
  useEffect,
  useRef,
} from 'react';

import {
  StatusBar,
} from 'expo-status-bar';

import * as Linking
  from 'expo-linking';

import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import {
  createStackNavigator,
} from '@react-navigation/stack';

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import HomeScreen
  from './src/screens/HomeScreen';

import GameScreen
  from './src/screens/GameScreen';

import ChallengeScreen
  from './src/screens/ChallengeScreen';

import SettingsScreen
  from './src/screens/SettingsScreen';

import {
  parseChallengeLink,
} from './src/services/deepLinks';

import {
  initializeSoundManager,
  unloadSoundManager,
} from './src/utils/sounds';

const Stack =
  createStackNavigator();

export default function App() {
  const navigationRef =
    useNavigationContainerRef();

  const pendingChallengeRef =
    useRef(null);

  const openChallenge =
    (challenge) => {
      if (!challenge) {
        return;
      }

      if (
        !navigationRef.isReady()
      ) {
        pendingChallengeRef.current =
          challenge;

        return;
      }

      navigationRef.navigate(
        'Challenge',
        {
          challenge,
        }
      );
    };

  const handleIncomingUrl =
    (url) => {
      const challenge =
        parseChallengeLink(url);

      if (!challenge) {
        return;
      }

      openChallenge(
        challenge
      );
    };

  useEffect(() => {
    void initializeSoundManager();

    return () => {
      void unloadSoundManager();
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    void Linking
      .getInitialURL()
      .then((url) => {
        if (
          isActive &&
          url
        ) {
          handleIncomingUrl(
            url
          );
        }
      })
      .catch((error) => {
        console.warn(
          'Initial deep link failed:',
          error
        );
      });

    const subscription =
      Linking.addEventListener(
        'url',
        ({ url }) => {
          handleIncomingUrl(
            url
          );
        }
      );

    return () => {
      isActive = false;

      subscription.remove();
    };
  }, []);

  const handleNavigationReady =
    () => {
      const pendingChallenge =
        pendingChallengeRef.current;

      if (!pendingChallenge) {
        return;
      }

      pendingChallengeRef.current =
        null;

      navigationRef.navigate(
        'Challenge',
        {
          challenge:
            pendingChallenge,
        }
      );
    };

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={
          handleNavigationReady
        }
      >
        <StatusBar
          style="light"
        />

        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="Home"
            component={
              HomeScreen
            }
          />

          <Stack.Screen
            name="Game"
            component={
              GameScreen
            }
          />

          <Stack.Screen
            name="Challenge"
            component={
              ChallengeScreen
            }
          />

          <Stack.Screen
            name="Settings"
            component={
              SettingsScreen
            }
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}