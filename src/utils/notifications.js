import { Platform } from 'react-native';

/*************************************************
 * DBT + CBT BREATHING REMINDER MESSAGES
 *************************************************/
const BREATHING_REMINDER_MESSAGES = [
  "Take one mindful breath and return to center.",
  "Pause. Notice one thing you can see, one thing you can feel.",
  "Breathe slowly — move into your Wise Mind.",
  "Let yourself arrive in this moment. One breath.",
  "Come back to your breath. Let the next inhale be softer.",
  "Notice where your breath lands in your body.",
  "Feel the rise and fall of your breathing — nothing else is required.",
  "Let this breath be a small reset.",
  "On your next inhale, soften your jaw.",
  "Gently return your attention to this moment.",
  "A slow breath helps you ride the wave, not fight it.",
  "Ground yourself: press your feet into the floor and inhale gently.",
  "You don't need to fix anything right now. Just breathe.",
  "Let your breathing be your anchor for the next 5 seconds.",
  "One breath at a time. That's enough in this moment.",
  "Let your shoulders drop on the next exhale.",
  "You are allowed to pause.",
  "A calmer breath can help unlock a calmer thought.",
  "Let your next inhale be a little slower than usual.",
  "You can stop, breathe, and start fresh at any moment.",
  "Place a hand on your chest and breathe slowly — let your body soften.",
  "You deserve calm. Let your next breath be kinder than the last.",
  "Notice warmth in your body as you exhale.",
  "Soften your shoulders and allow one deeper breath.",
  "Let your exhale fall longer than your inhale.",
  "You're doing the best you can. Breathe with that truth.",
  "Let your breath wrap you in steadiness.",
  "Gently unclench your hands on the next exhale.",
  "A breath can be a form of self-compassion.",
  "Let your body settle into this moment.",
  "Name the emotion you're feeling — then take one slow breath.",
  "A thought is just a thought. Breathe and watch it pass.",
  "You can observe this moment without judging it.",
  "A calm breath can shift the whole chain of thoughts.",
  "You are not your thoughts — breathe and pause the cycle.",
  "Let your breath interrupt the spiral, just for a second.",
  "Breathe and remind yourself: 'This moment is temporary.'",
  "Let one steady inhale break the momentum of stress.",
  "Notice how your body changes after even one slow breath.",
  "Your breath can help your mind unclench.",
  "Slow down your breathing — you are safe right now.",
  "Take a breath and remind yourself: 'This feeling will pass.'",
  "Notice tension in your body and release it on the next exhale.",
  "Let your breath remind you: you are here, and you are okay.",
  "Inhale stability; exhale pressure.",
  "A slow breath is a message to your body that you're safe.",
  "You can breathe through this moment — you're not alone in it.",
  "One slowing breath can help your nervous system settle.",
  "Your breath can carry you back into a calmer place.",
  "Let your next breath be a small act of safety.",
  "A calmer breath can help your mind find a calmer perspective.",
  "Breathe slowly. You are allowed to take up space and rest.",
  "Let your breath bring you back into your body, gently.",
  "You don’t need to rush — take one grounded breath.",
  "A deeper exhale helps your body release what it doesn’t need.",
  "With each breath, give yourself permission to slow down.",
  "Let your breath be the bridge to a steadier moment.",
  "A single breath can change the direction of the next minute.",
  "Let your breath reconnect you with yourself.",
  "Let your breath settle your nervous system.",
  "A quiet breath can steady a loud mind.",
  "Exhale slowly and feel your body loosen.",
  "Let one small breath remind you of your strength.",
  "Soften your face and breathe gently.",
  "Your breath can bring you back to safety.",
  "Let each inhale remind you that you’re still here.",
  "You can restart the moment with one calm breath.",
  "Let your lungs open gently, without pressure.",
  "A slow breath can untangle a tense moment.",
  "Let yourself breathe without rushing.",
  "One soft inhale can help you find your center.",
  "Let your breathing be a safe place to land.",
  "Feel the air move in and out — that’s enough.",
  "Let yourself breathe the way your body wants to breathe.",
  "Your breath is a friend when your thoughts get heavy.",
  "Let a slow exhale melt some tension away.",
  "A single breath can bring you into your Wise Mind.",
  "You are doing enough — breathe into that truth.",
  "Notice how your stomach rises with a calm inhale.",
  "Let your next breath be gentle and kind.",
  "A quiet breath can give your mind a moment of space.",
  "Breathe without judging your experience.",
  "Let your breath guide you back into your body.",
  "Your breath is something you can always return to.",
  "Let your breath loosen your shoulders slightly.",
  "Let your next inhale be soft and unforced.",
  "Slow down one breath — let that be your only task.",
  "Let the next breath remind you that you’re safe.",
  "A slow exhale can begin a calmer moment.",
  "Take a breath and imagine calm expanding inside you.",
  "Let your breathing gently reset your pace.",
  "You can breathe through this moment — one inhale at a time.",
  "Let your breath help you reconnect with yourself.",
  "A small breath can shift big feelings.",
  "Let your breath soften whatever feels tight inside you.",
  "Breathe in calm, breathe out tension.",
  "With each breath, return to this moment.",
  "Let the next breath be simple and easy.",
  "Take one breath without trying to change anything."
];

/*************************************************
 * CONFIGURATION
 *************************************************/
const DEV_MODE = false; // Set to true for testing
const MOOD_DAYS = DEV_MODE ? 2 : (Platform.OS === 'ios' ? 7 : 7); // iOS: 3 days (hourly reschedule), Android: 7 days (infrequent opens)
const BREATHING_COUNT = DEV_MODE ? 3 : (Platform.OS === 'ios' ? 112 : 112); // iOS: 1 day (hourly timer), Android: 7 days (AppState)
const BREATHING_INTERVAL = DEV_MODE ? 60 : 5400; // seconds (90 minutes)

/*************************************************
 * NOTIFICATION MODULE SETUP
 *************************************************/
let Notifications;
if (Platform.OS !== 'web') {
  Notifications = require('expo-notifications');

  Notifications.setNotificationHandler({
    handleNotification: async () => {
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    },
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
        name: 'Breathing Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        enableVibrate: true,
        showBadge: false,
        bypassDnd: false,
      });
      console.log('🔔 [NOTIF] Android channel "default" set with HIGH importance');
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
    let scheduled = 0;
    
    // Schedule for next MOOD_DAYS days
    for (let i = 0; i < MOOD_DAYS; i++) {
      const triggerDate = new Date(now);
      triggerDate.setDate(triggerDate.getDate() + i);
      triggerDate.setHours(20, 0, 0, 0);
      
      // Skip if in the past
      if (triggerDate.getTime() <= Date.now()) {
        console.log(`⏭️ [NOTIF] Skipping past mood reminder at ${triggerDate.toLocaleString()}`);
        continue;
      }
      
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Check-in",
          body: "How are you feeling today? Take a moment to log your mood.",
          data: { type: 'mood_reminder' },
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          categoryIdentifier: 'reminder',
        },
        trigger: { type: 'date', date: triggerDate },
      });
      
      scheduled++;
      
      if (scheduled === 1) {
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

    const now = Date.now();
    let scheduled = 0;
    
    // Schedule BREATHING_COUNT notifications
    for (let i = 1; i <= BREATHING_COUNT; i++) {
      const triggerTime = now + (BREATHING_INTERVAL * 1000 * i);
      const triggerDate = new Date(triggerTime);
      
      // Skip if in the past (shouldn't happen, but safety check)
      if (triggerTime <= Date.now()) {
        console.log(`⏭️ [NOTIF] Skipping past notification at ${triggerDate.toLocaleString()}`);
        continue;
      }
      
      const randomMessage = BREATHING_REMINDER_MESSAGES[
        Math.floor(Math.random() * BREATHING_REMINDER_MESSAGES.length)
      ];
      
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Breathing Break",
          body: randomMessage,
          data: { type: 'breathing_reminder' },
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          categoryIdentifier: 'reminder',
        },
        trigger: { type: 'date', date: triggerDate },
      });
      
      scheduled++;
      
      if (scheduled === 1) {
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
    
    // Get last reset date from storage
    const { storage } = require('./storage');
    const lastReset = await storage.getItem('last_reset') || 0;
    const now = new Date();
    const currentDate = now.getDate();
    
    return {
      exportDate: new Date().toISOString(),
      totalScheduled: scheduled.length,
      summary: {
        moodReminders: byType.mood.length,
        breathingReminders: byType.breathing.length,
        midnightReset: byType.reset.length
      },
      rescheduleSystem: {
        platform: Platform.OS,
        ios: {
          method: 'setInterval timer',
          checkInterval: '3600000ms (1 hour)',
          breathingCount: 16,
          moodDays: 2,
          note: 'Hourly timer checks date change while app is open, reschedules daily'
        },
        android: {
          method: 'AppState listener',
          checkInterval: 'On app foreground',
          breathingCount: 112,
          moodDays: 7,
          note: 'Checks date change when app comes to foreground, needs longer coverage'
        },
        lastResetDate: lastReset,
        currentDate: currentDate,
        willResetToday: lastReset !== currentDate
      },
      debugTriggerSample: scheduled.length > 0 ? scheduled[0].trigger : null,
      notifications: scheduled.map(n => {
        let triggerDate = 'unknown';
        if (n.trigger?.date) {
          triggerDate = new Date(n.trigger.date).toISOString();
        } else if (n.trigger?.seconds) {
          triggerDate = new Date(Date.now() + n.trigger.seconds * 1000).toISOString();
        } else if (n.trigger?.value) {
          triggerDate = new Date(n.trigger.value).toISOString();
        }
        return {
          id: n.identifier,
          type: n.content.data?.type || 'unknown',
          title: n.content.title,
          body: n.content.body,
          trigger: n.trigger,
          triggerDate: triggerDate
        };
      })
    };
  } catch (e) {
    console.error('❌ [NOTIF] Failed to export notifications:', e);
    return null;
  }
};
