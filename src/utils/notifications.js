import { Platform } from 'react-native';

const BREATHING_REMINDER_MESSAGES = [
  // DBT – Mindfulness
  "Take one mindful breath and return to center.",
  "Pause. Notice one thing you can see, one thing you can feel.",
  "Breathe slowly — move into your Wise Mind.",
  "Let yourself arrive in this moment. One breath.",
  "Come back to your breath. Let the next inhale be softer.",

  // DBT – Distress Tolerance
  "A slow breath helps you ride the wave, not fight it.",
  "Ground yourself: press your feet into the floor and inhale gently.",
  "You don't need to fix anything right now. Just breathe.",
  "Let your breathing be your anchor for the next 5 seconds.",
  "One breath at a time. That's enough in this moment.",

  // DBT – Self-Soothing
  "Place a hand on your chest and breathe slowly — let your body soften.",
  "You deserve calm. Let your next breath be kinder than the last.",
  "Notice warmth in your body as you exhale.",
  "Soften your shoulders and allow one deeper breath.",
  "Let your exhale fall longer than your inhale.",

  // CBT – Emotion Regulation
  "Name the emotion you're feeling — then take one slow breath.",
  "A thought is just a thought. Breathe and watch it pass.",
  "You can observe this moment without judging it.",
  "A calm breath can shift the whole chain of thoughts.",
  "You are not your thoughts — breathe and pause the cycle.",

  // CBT – Grounding & Reframing
  "Slow down your breathing — you are safe right now.",
  "Take a breath and remind yourself: 'This feeling will pass.'",
  "Notice tension in your body and release it on the next exhale.",
  "A calmer breath can help your mind find a calmer perspective.",
  "Breathe slowly. You are allowed to take up space and rest."
];

let Notifications;
if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');
  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export const requestPermissions = async () => {
  if (Platform.OS === 'web') {
    console.log('Notifications not supported on web');
    return false;
  }
  
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2E8B57',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const scheduleMoodReminder = async () => {
  if (Platform.OS === 'web') return;
  
  try {
    await cancelMoodReminder();
    
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
    
    console.log('✅ Mood reminder scheduled - Daily at 8:00 PM');
  } catch (error) {
    console.error('Failed to schedule mood reminder:', error);
  }
};

export const cancelMoodReminder = async () => {
  if (Platform.OS === 'web') return;
  
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const moodReminders = scheduled.filter(n => n.content.data?.type === 'mood_reminder');
    await Promise.all(moodReminders.map(n => Notifications.cancelScheduledNotificationAsync(n.identifier)));
    console.log(`🧹 Cancelled ${moodReminders.length} mood reminder(s)`);
  } catch (error) {
    console.error('Failed to cancel mood reminders:', error);
  }
};

export const scheduleBreathingReminder = async () => {
  if (Platform.OS === 'web') return;
  
  try {
    await cancelBreathingReminder();
    
    const randomMessage = BREATHING_REMINDER_MESSAGES[Math.floor(Math.random() * BREATHING_REMINDER_MESSAGES.length)];
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Breathing Break",
        body: randomMessage,
        data: { type: 'breathing_reminder' },
      },
      trigger: {
        seconds: 3600,
        repeats: true,
      },
    });
    
    console.log('✅ Breathing reminder scheduled - Every hour');
  } catch (error) {
    console.error('Failed to schedule breathing reminder:', error);
  }
};

export const cancelBreathingReminder = async () => {
  if (Platform.OS === 'web') return;
  
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const breathingReminders = scheduled.filter(n => n.content.data?.type === 'breathing_reminder');
    await Promise.all(breathingReminders.map(n => Notifications.cancelScheduledNotificationAsync(n.identifier)));
    console.log(`🧹 Cancelled ${breathingReminders.length} breathing reminder(s)`);
  } catch (error) {
    console.error('Failed to cancel breathing reminders:', error);
  }
};

export const clearAllNotifications = async () => {
  if (Platform.OS === 'web') return;
  
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('🧹 Cleared all notifications');
  } catch (error) {
    console.error('Failed to clear all notifications:', error);
  }
};
