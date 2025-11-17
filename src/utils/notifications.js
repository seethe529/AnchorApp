import { Platform } from 'react-native';

let Notifications;
if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
  
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      // Only show notifications when app is in background
      const trigger = notification.request.trigger;
      const isScheduled =
        trigger?.type === 'calendar' ||
        trigger?.type === 'date' ||        // iOS
        trigger?.type === 'timeInterval';
      
      return {
        shouldShowAlert: isScheduled, // Only show scheduled notifications
        shouldShowBanner: isScheduled,
        shouldShowList: true,
        shouldPlaySound: isScheduled,
        shouldSetBadge: false,
      };
    },
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
  
  // Schedule for 8:00 PM daily (will fire tomorrow if already past 8pm today)
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
};

export const scheduleMedicationReminder = async (medication) => {
  if (Platform.OS === 'web') return;
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Medication Reminder",
      body: `Time to take your ${medication.name}.`,
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
  
  // iOS doesn't support seconds with repeats, so schedule multiple individual notifications
  // Schedule 24 notifications (one per hour for the next 24 hours)
  const ids = [];
  for (let i = 1; i <= 24; i++) {
    const triggerDate = new Date();
    triggerDate.setHours(triggerDate.getHours() + i);
    triggerDate.setMinutes(0);
    triggerDate.setSeconds(0);
    
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Breathing Break",
        body: "Take a moment for a quick breathing exercise.",
        data: { type: 'breathing_reminder' },
      },
      trigger: triggerDate,
    });
    ids.push(id);
  }
  
  console.log(`✅ Breathing reminders scheduled (${ids.length} notifications) - Hourly for next 24h`);
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