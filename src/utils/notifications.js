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
  "Take one breath without trying to change anything.",
  "Your breath is always available — use it now.",
  "Let your inhale fill you with steadiness.",
  "Breathe and notice: you are here, you are present.",
  "One mindful breath can interrupt anxiety's momentum.",
  "Let your exhale release what you're holding onto.",
  "Breathe into your belly — let it rise and fall naturally.",
  "Your breath is a tool you carry everywhere.",
  "Let this breath be an anchor in uncertainty.",
  "Soften your chest and breathe without effort.",
  "Notice the pause between breaths — rest there.",
  "Let your breath remind you: this too shall pass.",
  "Breathe slowly and feel your heartbeat calm.",
  "One gentle breath can shift your entire nervous system.",
  "Let your breath be a refuge when thoughts feel overwhelming.",
  "Inhale peace, exhale worry.",
  "Your breath connects you to the present moment.",
  "Let each exhale soften your grip on tension.",
  "Breathe and give yourself permission to just be.",
  "Notice how your breath moves through your body.",
  "Let your breathing be effortless and natural.",
  "One slow breath can create space between you and your thoughts.",
  "Your breath is a bridge back to calm.",
  "Let your inhale be deep, your exhale be long.",
  "Breathe and remind yourself: I am safe in this moment.",
  "Let your breath ground you like roots in the earth.",
  "Notice the coolness of air as you inhale.",
  "Your breath can help you ride out difficult emotions.",
  "Let each breath be a small act of self-care.",
  "Breathe and feel your feet on the ground.",
  "One conscious breath brings you back to now.",
  "Let your breath soften the edges of stress.",
  "Inhale courage, exhale fear.",
  "Your breath is a constant companion in healing.",
  "Let your breathing slow down racing thoughts.",
  "Notice how your body relaxes with each exhale.",
  "Breathe and trust that you can handle this moment.",
  "Let your breath create a pause in the chaos.",
  "One deep breath can shift your perspective.",
  "Your breath reminds you that you're alive and okay.",
  "Let each inhale bring fresh energy, each exhale release fatigue.",
  "Breathe and notice: you are stronger than you think.",
  "Let your breath be gentle with you today.",
  "One mindful breath is an act of radical self-compassion.",
  "Your breath can help you tolerate distress.",
  "Let your breathing be your safe place right now.",
  "Breathe and know: this feeling is temporary.",
  "Let each breath remind you of your resilience.",
  "Your breath is always working to support you."
];


/*************************************************
 * CONFIGURATION
 *************************************************/
const DEV_MODE = false; // Set to true for testing
const MOOD_DAYS = DEV_MODE ? 2 : (Platform.OS === 'ios' ? 7 : 7); // iOS: 7 days, Android: 7 days
const BREATHING_COUNT = DEV_MODE ? 3 : (Platform.OS === 'ios' ? 48 : 112); // iOS: 48 (3 days, stays under 64 limit), Android: 112 (7 days)
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
 * MOOD REMINDER — DAILY AT CUSTOM TIME
 *************************************************/
export const scheduleMoodReminder = async ({ hour = 20, minute = 0 } = {}) => {
  console.log(`🌙 [NOTIF] scheduleMoodReminder called for ${hour}:${minute}`);

  if (Platform.OS === 'web') {
    console.log('⚠️ [NOTIF] Platform web — skip mood reminder');
    return;
  }

  try {
    await cancelMoodReminder();
    console.log('🧹 [NOTIF] Existing mood reminders cancelled');

    const now = new Date();
    let scheduled = 0;
    
    // Schedule for next MOOD_DAYS days
    for (let i = 0; i < MOOD_DAYS; i++) {
      const triggerDate = new Date(now);
      triggerDate.setDate(triggerDate.getDate() + i);
      triggerDate.setHours(hour, minute, 0, 0);
      
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
 * SHUFFLE ALGORITHM FOR MESSAGE VARIETY
 *************************************************/
export const shuffleMessages = (messages) => {
  const shuffled = [...messages];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/*************************************************
 * BREATHING REMINDER — HOURLY
 *************************************************/
export const scheduleBreathingReminder = async (intervalMinutes = 90) => {
  console.log(`🫁 [NOTIF] scheduleBreathingReminder called with ${intervalMinutes} minute interval`);

  if (Platform.OS === 'web' || !Notifications) {
    console.log('⚠️ [NOTIF] Platform web or Notifications missing — skip breathing reminder');
    return;
  }

  try {
    await cancelBreathingReminder();
    console.log('🧹 [NOTIF] Existing breathing reminders cancelled');

    // Calculate how many notifications based on platform
    const intervalSeconds = intervalMinutes * 60;
    const notificationsPerDay = Math.floor((24 * 60) / intervalMinutes);
    const coverageDays = Platform.OS === 'ios' ? 3 : 7; // iOS: 3 days, Android: 7 days
    const breathingCount = notificationsPerDay * coverageDays;
    
    console.log(`📊 [NOTIF] Platform: ${Platform.OS}, Interval: ${intervalMinutes}min, Per day: ${notificationsPerDay}, Coverage: ${coverageDays} days, Total: ${breathingCount}`);

    // Shuffle messages for maximum variety - no repeats until all 150 are seen
    const shuffledMessages = shuffleMessages(BREATHING_REMINDER_MESSAGES);
    console.log(`🔀 [NOTIF] Shuffled ${shuffledMessages.length} unique messages for variety`);

    const now = Date.now();
    let scheduled = 0;
    
    // Schedule breathing notifications
    for (let i = 1; i <= breathingCount; i++) {
      const triggerTime = now + (intervalSeconds * 1000 * i);
      const triggerDate = new Date(triggerTime);
      
      // Skip if in the past (shouldn't happen, but safety check)
      if (triggerTime <= Date.now()) {
        console.log(`⏭️ [NOTIF] Skipping past notification at ${triggerDate.toLocaleString()}`);
        continue;
      }
      
      // Use shuffled messages in order, cycling through if needed
      const messageIndex = (i - 1) % shuffledMessages.length;
      const message = shuffledMessages[messageIndex];
      
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Breathing Break",
          body: message,
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
        console.log(`💬 [NOTIF] Sample message: "${message}"`);
      }
    }

    console.log(`✅ [NOTIF] ${breathingCount} breathing reminders scheduled (every ${intervalMinutes} minutes, ${coverageDays} days coverage)`);
    console.log(`🎲 [NOTIF] Using shuffled sequence - all ${shuffledMessages.length} messages will appear before any repeat`);
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
          coverageDays: 3,
          note: 'Hourly timer checks date change while app is open, reschedules daily with 3-day coverage'
        },
        android: {
          method: 'AppState listener',
          checkInterval: 'On app foreground',
          coverageDays: 7,
          note: 'Checks date change when app comes to foreground, 7-day coverage for less frequent app opens'
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
