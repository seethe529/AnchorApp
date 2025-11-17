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
  
  // Cancel any existing mood reminders first
  await cancelReminderType('mood_reminder');
  
  const id = await Notifications.scheduleNotificationAsync({
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
  
  console.log(`✅ Mood reminder scheduled (ID: ${id}) - Daily at 8:00 PM`);
  
  // Debug: Show all scheduled
  const all = await Notifications.getAllScheduledNotificationsAsync();
  console.log(`📋 Total scheduled notifications: ${all.length}`);
};

export const scheduleMedicationReminder = async (medication) => {
  if (Platform.OS === 'web') return;
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Medication Reminder",
      body: `Time to take your ${medication.name}.",
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
  
  // Cancel any existing breathing reminders first
  await cancelReminderType('breathing_reminder');
  
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Breathing Break",
      body: "Take a moment for a quick breathing exercise.",
      data: { type: 'breathing_reminder' },
    },
    trigger: {
      seconds: 3600, // Every hour
      repeats: true,
    },
  });
  
  console.log(`✅ Breathing reminder scheduled (ID: ${id}) - Every hour`);
  
  // Debug: Show all scheduled
  const all = await Notifications.getAllScheduledNotificationsAsync();
  console.log(`📋 Total scheduled notifications: ${all.length}`);
};

// Generic helper to cancel by type
export const cancelReminderType = async (type) => {
  if (Platform.OS === 'web') return;
  
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const toCancel = scheduled.filter(n => n.content.data?.type === type);
  await Promise.all(toCancel.map(n => Notifications.cancelScheduledNotificationAsync(n.identifier)));
  console.log(`🧹 Cancelled ${toCancel.length} notifications of type: ${type}`);
};

export const cancelMoodReminder = async () => {
  await cancelReminderType('mood_reminder');
};

export const cancelBreathingReminder = async () => {
  await cancelReminderType('breathing_reminder');
};