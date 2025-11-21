import { Platform } from 'react-native';

/*************************************************
 * DBT + CBT BREATHING REMINDER MESSAGES
 *************************************************/
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

/*************************************************
 * CONFIGURATION
 *************************************************/
const DEV_MODE = false; // Set to true for testing
const MOOD_DAYS = DEV_MODE ? 2 : 7;
const BREATHING_COUNT = DEV_MODE ? 3 : 16;
const BREATHING_INTERVAL = DEV_MODE ? 60 : 5400; // seconds (90 minutes)

/*************************************************
 * NOTIFICATION MODULE SETUP
 *************************************************/
let Notifications;
if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');

  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      const isSystemReset = notification.request.content.data?.type === 'system_reset';
      
      return {
        shouldShowAlert: !isSystemReset,
        shouldPlaySound: !isSystemReset,
        shouldSetBadge: false,
      };
    },
  });

  // Listen for notification responses (when user taps notification)
  Notifications.addNotificationResponseReceivedListener(async (response) => {
    const type = response.notification.request.content.data?.type;
    
    if (type === 'system_reset') {
      console.log('🌙 [NOTIF] Midnight reset triggered');
      await handleMidnightReset();
    }
  });

  console.log('📦 [NOTIF] Notification handler set up');
}

/*************************************************
 * PERMISSIONS
 *************************************************/
export const requestPermissions = async () => {
  console.log('📱 [NOTIF] requestPermissions called');

  if (Platform.OS === 'web') {
    console.log('⚠️ [NOTIF] Platform web — skip permissions');
    return false;
  }

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
      console.log('🔔 [NOTIF] Android channel "default" set');
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    console.log(`🔍 [NOTIF] Existing permission status: ${existing}`);

    if (existing === 'granted') {
      console.log('✅ [NOTIF] Permissions already granted');
      return true;
    }

    const { status: requested } = await Notifications.requestPermissionsAsync();
    console.log(`🔍 [NOTIF] Requested permission status: ${requested}`);
    const granted = requested === 'granted';
    console.log(`✅ [NOTIF] Final permission status: ${granted ? 'granted' : 'denied'}`);
    return granted;
  } catch (e) {
    console.error('❌ [NOTIF] Permission error:', e);
    return false;
  }
};

/*************************************************
 * MOOD REMINDER — DAILY AT 8 PM
 *************************************************/
export const scheduleMoodReminder = async () => {
  console.log('🌙 [NOTIF] scheduleMoodReminder called');

  if (Platform.OS === 'web') {
    console.log('⚠️ [NOTIF] Platform web — skip mood reminder');
    return;
  }

  try {
    await cancelMoodReminder();
    console.log('🧹 [NOTIF] Existing mood reminders cancelled');

    const now = new Date();
    const currentHour = now.getHours();
    
    // Schedule for next MOOD_DAYS days
    for (let i = 0; i < MOOD_DAYS; i++) {
      const triggerDate = new Date(now);
      triggerDate.setDate(triggerDate.getDate() + i);
      triggerDate.setHours(20, 0, 0, 0);
      
      // If it's already past 8 PM today and this is day 0, skip to tomorrow
      if (i === 0 && currentHour >= 20) {
        console.log('⏭️ [NOTIF] Already past 8 PM today, skipping to tomorrow');
        continue;
      }
      
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Check-in",
          body: "How are you feeling today? Take a moment to log your mood.",
          data: { type: 'mood_reminder' },
        },
        trigger: { type: 'date', date: triggerDate },
      });
      
      if (i === 0 || (i === 1 && currentHour >= 20)) {
        console.log(`📋 [NOTIF] First mood reminder at: ${triggerDate.toLocaleString()}`);
      }
    }

    console.log(`✅ [NOTIF] ${MOOD_DAYS} mood reminders scheduled`);
  } catch (e) {
    console.error('❌ [NOTIF] Mood reminder schedule fail:', e);
  }
};

export const cancelMoodReminder = async () => {
  console.log('🗑️ [NOTIF] cancelMoodReminder called');

  if (Platform.OS === 'web') {
    console.log('⚠️ [NOTIF] Platform web — skip cancelMoodReminder');
    return;
  }

  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const mood = scheduled.filter(n => n.content.data?.type === 'mood_reminder');
    console.log(`🔍 [NOTIF] Found ${mood.length} mood reminders to cancel`);

    for (const n of mood) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }

    console.log(`✅ [NOTIF] Mood reminders cancelled: ${mood.length}`);
  } catch (e) {
    console.error('❌ [NOTIF] Mood reminder cancel fail:', e);
  }
};

/*************************************************
 * BREATHING REMINDER — HOURLY
 *************************************************/
export const scheduleBreathingReminder = async () => {
  console.log('🫁 [NOTIF] scheduleBreathingReminder called');

  if (Platform.OS === 'web' || !Notifications) {
    console.log('⚠️ [NOTIF] Platform web or Notifications missing — skip breathing reminder');
    return;
  }

  try {
    await cancelBreathingReminder();
    console.log('🧹 [NOTIF] Existing breathing reminders cancelled');

    const now = new Date();
    
    // Schedule BREATHING_COUNT notifications
    for (let i = 1; i <= BREATHING_COUNT; i++) {
      const triggerDate = new Date(now);
      triggerDate.setSeconds(triggerDate.getSeconds() + (BREATHING_INTERVAL * i));
      
      const randomMessage = BREATHING_REMINDER_MESSAGES[
        Math.floor(Math.random() * BREATHING_REMINDER_MESSAGES.length)
      ];
      
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Breathing Break",
          body: randomMessage,
          data: { type: 'breathing_reminder' },
        },
        trigger: { type: 'date', date: triggerDate },
      });
      
      if (i === 1) {
        console.log(`📋 [NOTIF] First breathing reminder at: ${triggerDate.toLocaleString()}`);
        console.log(`💬 [NOTIF] Sample message: "${randomMessage}"`);
      }
    }

    console.log(`✅ [NOTIF] ${BREATHING_COUNT} breathing reminders scheduled (every ${BREATHING_INTERVAL}s)`);
  } catch (e) {
    console.error('❌ [NOTIF] Breathing reminder schedule fail:', e);
  }
};

export const cancelBreathingReminder = async () => {
  console.log('🗑️ [NOTIF] cancelBreathingReminder called');

  if (Platform.OS === 'web') {
    console.log('⚠️ [NOTIF] Platform web — skip cancelBreathingReminder');
    return;
  }

  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const breathing = scheduled.filter(n => n.content.data?.type === 'breathing_reminder');
    console.log(`🔍 [NOTIF] Found ${breathing.length} breathing reminders to cancel`);

    for (const n of breathing) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }

    console.log(`✅ [NOTIF] Breathing reminders cancelled: ${breathing.length}`);
  } catch (e) {
    console.error('❌ [NOTIF] Breathing reminder cancel fail:', e);
  }
};

/*************************************************
 * MIDNIGHT AUTO-RESET SYSTEM
 *************************************************/
const handleMidnightReset = async () => {
  console.log('🌙 [NOTIF] handleMidnightReset triggered');
  
  try {
    // Reschedule all notifications
    await scheduleBreathingReminder();
    await scheduleMoodReminder();
    
    // Schedule next midnight reset
    await scheduleDailyReset();
    
    console.log('✅ [NOTIF] Midnight reset complete');
  } catch (e) {
    console.error('❌ [NOTIF] Midnight reset failed:', e);
  }
};

export const scheduleDailyReset = async () => {
  console.log('🌙 [NOTIF] scheduleDailyReset called');
  
  if (Platform.OS === 'web' || !Notifications) {
    console.log('⚠️ [NOTIF] Platform web or Notifications missing — skip daily reset');
    return;
  }
  
  try {
    // Cancel any existing reset notifications
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const resets = scheduled.filter(n => n.content.data?.type === 'system_reset');
    for (const n of resets) {
      await Notifications.cancelScheduledNotificationAsync(n.identifier);
    }
    console.log(`🧹 [NOTIF] Cancelled ${resets.length} existing reset notification(s)`);
    
    // Calculate next midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setDate(midnight.getDate() + 1);
    midnight.setHours(0, 0, 0, 0);
    
    // Schedule silent system notification for midnight
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "System Maintenance",
        body: "Updating reminders...",
        data: { type: 'system_reset' },
        sound: null,
      },
      trigger: { type: 'date', date: midnight },
    });
    
    console.log(`✅ [NOTIF] Daily reset scheduled for: ${midnight.toLocaleString()} (ID: ${id})`);
  } catch (e) {
    console.error('❌ [NOTIF] Daily reset schedule fail:', e);
  }
};

/*************************************************
 * CLEAR ALL
 *************************************************/
export const clearAllNotifications = async () => {
  console.log('🗑️ [NOTIF] clearAllNotifications called');

  if (Platform.OS === 'web') {
    console.log('⚠️ [NOTIF] Platform web — skip clearAllNotifications');
    return;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ [NOTIF] All notifications cleared');
  } catch (e) {
    console.error('❌ [NOTIF] Clear notifications fail:', e);
  }
};

/*************************************************
 * DEBUG — LIST ALL SCHEDULED NOTIFICATIONS
 *************************************************/
export const debugListScheduled = async () => {
  console.log('🔍 [NOTIF] debugListScheduled called');

  if (Platform.OS === 'web' || !Notifications) {
    console.log('⚠️ [NOTIF] Platform web or Notifications missing — skip debugListScheduled');
    return;
  }

  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log(`🔎 [NOTIF] Total scheduled: ${scheduled.length}`);
    
    const byType = {
      mood: scheduled.filter(n => n.content.data?.type === 'mood_reminder'),
      breathing: scheduled.filter(n => n.content.data?.type === 'breathing_reminder'),
      reset: scheduled.filter(n => n.content.data?.type === 'system_reset'),
    };
    
    console.log(`  📊 Mood: ${byType.mood.length}, Breathing: ${byType.breathing.length}, Reset: ${byType.reset.length}`);
    console.log('🔎 [NOTIF] FULL LIST:', JSON.stringify(scheduled, null, 2));
  } catch (e) {
    console.error('❌ [NOTIF] Failed to list scheduled notifications:', e);
  }
};

export const exportScheduledNotifications = async () => {
  if (Platform.OS === 'web' || !Notifications) {
    return null;
  }

  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    
    const byType = {
      mood: scheduled.filter(n => n.content.data?.type === 'mood_reminder'),
      breathing: scheduled.filter(n => n.content.data?.type === 'breathing_reminder'),
      reset: scheduled.filter(n => n.content.data?.type === 'system_reset'),
    };
    
    return {
      exportDate: new Date().toISOString(),
      totalScheduled: scheduled.length,
      summary: {
        moodReminders: byType.mood.length,
        breathingReminders: byType.breathing.length,
        midnightReset: byType.reset.length
      },
      debugTriggerSample: scheduled.length > 0 ? scheduled[0].trigger : null,
      notifications: scheduled.map(n => ({
        id: n.identifier,
        type: n.content.data?.type || 'unknown',
        title: n.content.title,
        body: n.content.body,
        trigger: n.trigger,
        triggerDate: n.trigger?.seconds ? new Date(Date.now() + (n.trigger.seconds * 1000)).toISOString() : (n.trigger?.date ? new Date(n.trigger.date).toISOString() : (n.trigger?.value ? new Date(n.trigger.value * 1000).toISOString() : 'unknown'))
      }))
    };
  } catch (e) {
    console.error('❌ [NOTIF] Failed to export notifications:', e);
    return null;
  }
};
