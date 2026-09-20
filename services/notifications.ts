import * as Device from 'expo-device';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

let Notifications: typeof import('expo-notifications') | null = null;

// Safely load expo-notifications (prevents SDK 53+ Expo Go crash)
try {
  const isExpoGo =
    Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
    (Constants as any).appOwnership === 'expo';

  if (!isExpoGo) {
    Notifications = require('expo-notifications');
    if (Notifications && Notifications.setNotificationHandler) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    }
  }
} catch (e) {
  console.warn('Expo Go Notifications warning:', e);
}

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Notifications) {
    console.log('ℹ️ Push notifications are disabled in Expo Go SDK 53+. Use a development build for native push tokens.');
    return null;
  }

  let token: string | null = null;

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10B981',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Failed to get push token for push notification!');
        return null;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ||
        (Constants as any)?.easConfig?.projectId;

      const pushTokenData = await Notifications.getExpoPushTokenAsync(
        projectId ? { projectId } : undefined
      );
      token = pushTokenData?.data || null;
    } else {
      console.log('Push notifications require a physical device.');
    }
  } catch (e) {
    console.warn('Expo Push Token Registration:', e);
    return null;
  }

  return token;
}
