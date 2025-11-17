import { Platform } from 'react-native';

let Notifications;
if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true, // Keep for backwards compatibility
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export const setupNotifications = async () => {
  if (Platform.OS === 'web') {
    console.log('Notifications not supported on web');
    return false;
  }
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  return finalStatus === 'granted';
};

export const scheduleMoodReminder = async () => {
  if (Platform.OS === 'web') return;
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Daily Check-in",
      body: "How are you feeling today? Take a moment to log your mood.",
      data: { type: 'mood_reminder' },
    },
    trigger: {
      hour: 20,
      minute: 0,
      repeats: true,
    },
  });
};

export const scheduleMedicationReminder = async (medication) => {
  if (Platform.OS === 'web') return;
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Medication Reminder",
      body: `Time to take your ${medication.name}`,
      data: { type: 'medication', medicationId: medication.id },
    },
    trigger: {
      hour: medication.hour,
      minute: medication.minute,
      repeats: true,
    },
  });
};

export const scheduleBreathingReminder = async () => {
  if (Platform.OS === 'web') return;
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Breathing Break",
      body: "Take a moment for a quick breathing exercise",
      data: { type: 'breathing_reminder' },
    },
    trigger: {
      seconds: 3600, // Every hour
      repeats: true,
    },
  });
};

export const cancelMoodReminder = async () => {
  if (Platform.OS === 'web') return;
  
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const moodNotifications = scheduledNotifications.filter(
    notif => notif.content.data?.type === 'mood_reminder'
  );
  
  for (const notif of moodNotifications) {
    await Notifications.cancelScheduledNotificationAsync(notif.identifier);
  }
};

export const cancelBreathingReminder = async () => {
  if (Platform.OS === 'web') return;
  
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const breathingNotifications = scheduledNotifications.filter(
    notif => notif.content.data?.type === 'breathing_reminder'
  );
  
  for (const notif of breathingNotifications) {
    await Notifications.cancelScheduledNotificationAsync(notif.identifier);
  }
};