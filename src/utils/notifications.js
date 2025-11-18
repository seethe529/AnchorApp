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
  
  try {
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
  } catch (error) {
    console.error('Failed to schedule mood reminder:', error);
  }
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
  
  try {
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
      
      // Select random message
      const randomMessage = BREATHING_REMINDER_MESSAGES[Math.floor(Math.random() * BREATHING_REMINDER_MESSAGES.length)];
      
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Breathing Break",
          body: randomMessage,
          data: { type: 'breathing_reminder' },
        },
        trigger: triggerDate,
      });
      ids.push(id);
    }
    
    console.log(`✅ Breathing reminders scheduled (${ids.length} notifications) - Hourly for next 24h`);
  } catch (error) {
    console.error('Failed to schedule breathing reminders:', error);
  }
};

// Reschedule breathing reminders if running low (called on app foreground)
export const recheckBreathingReminders = async () => {
  if (Platform.OS === 'web') return;
  
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const breathingReminders = scheduled.filter(n => n.content.data?.type === 'breathing_reminder');
    
    // Check if any old notifications exist (they won't have the new message format)
    const hasOldNotifications = breathingReminders.some(n => 
      !BREATHING_REMINDER_MESSAGES.includes(n.content.body)
    );
    
    // If we have old notifications or less than 12 hours left, reschedule
    if (hasOldNotifications || breathingReminders.length < 12) {
      console.log(`🔄 ${hasOldNotifications ? 'Old notifications detected' : `Only ${breathingReminders.length} reminders left`}, rescheduling...`);
      await scheduleBreathingReminder();
    }
  } catch (error) {
    console.error('Failed to recheck breathing reminders:', error);
  }
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