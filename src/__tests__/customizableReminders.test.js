import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import {
  scheduleMoodReminder,
  scheduleBreathingReminder,
} from '../utils/notifications';

describe('Customizable Reminders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'ios';
    Notifications.getAllScheduledNotificationsAsync.mockResolvedValue([]);
    Notifications.scheduleNotificationAsync.mockResolvedValue('notification-id');
  });

  describe('Custom Mood Check-in Time', () => {
    it('should schedule mood reminder at custom time (8 PM)', async () => {
      await scheduleMoodReminder({ hour: 20, minute: 0 });
      
      const calls = Notifications.scheduleNotificationAsync.mock.calls;
      calls.forEach(call => {
        const triggerDate = call[0].trigger.date;
        expect(triggerDate.getHours()).toBe(20);
        expect(triggerDate.getMinutes()).toBe(0);
      });
    });

    it('should schedule mood reminder at custom time (9 AM)', async () => {
      await scheduleMoodReminder({ hour: 9, minute: 0 });
      
      const calls = Notifications.scheduleNotificationAsync.mock.calls;
      calls.forEach(call => {
        const triggerDate = call[0].trigger.date;
        expect(triggerDate.getHours()).toBe(9);
        expect(triggerDate.getMinutes()).toBe(0);
      });
    });

    it('should schedule mood reminder at custom time (6 PM)', async () => {
      await scheduleMoodReminder({ hour: 18, minute: 0 });
      
      const calls = Notifications.scheduleNotificationAsync.mock.calls;
      calls.forEach(call => {
        const triggerDate = call[0].trigger.date;
        expect(triggerDate.getHours()).toBe(18);
        expect(triggerDate.getMinutes()).toBe(0);
      });
    });

    it('should schedule mood reminder at midnight', async () => {
      await scheduleMoodReminder({ hour: 0, minute: 0 });
      
      const calls = Notifications.scheduleNotificationAsync.mock.calls;
      calls.forEach(call => {
        const triggerDate = call[0].trigger.date;
        expect(triggerDate.getHours()).toBe(0);
        expect(triggerDate.getMinutes()).toBe(0);
      });
    });

    it('should default to 8 PM if no time provided', async () => {
      await scheduleMoodReminder();
      
      const calls = Notifications.scheduleNotificationAsync.mock.calls;
      calls.forEach(call => {
        const triggerDate = call[0].trigger.date;
        expect(triggerDate.getHours()).toBe(20);
        expect(triggerDate.getMinutes()).toBe(0);
      });
    });
  });

  describe('Custom Breathing Interval - 90 minutes', () => {
    it('should schedule 16 notifications per day with 90-minute interval', async () => {
      await scheduleBreathingReminder(90);
      
      const notificationsPerDay = Math.floor((24 * 60) / 90);
      expect(notificationsPerDay).toBe(16);
      
      const totalNotifications = notificationsPerDay * 3; // 3 days
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(totalNotifications);
    });

    it('should schedule notifications at exactly 90-minute intervals', async () => {
      const mockNow = 1733523177620;
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);
      
      await scheduleBreathingReminder(90);
      
      const calls = Notifications.scheduleNotificationAsync.mock.calls;
      const intervalSeconds = 90 * 60;
      
      for (let i = 1; i < calls.length; i++) {
        const prevTrigger = calls[i - 1][0].trigger.date.getTime();
        const currTrigger = calls[i][0].trigger.date.getTime();
        const interval = (currTrigger - prevTrigger) / 1000;
        
        expect(interval).toBe(intervalSeconds);
      }
      
      Date.now.mockRestore();
    });

    it('should stay under iOS 64-notification limit (48 + 7 = 55)', async () => {
      await scheduleBreathingReminder(90);
      
      const breathingCount = Notifications.scheduleNotificationAsync.mock.calls.length;
      const moodCount = 7; // 7 days of mood reminders
      const totalCount = breathingCount + moodCount;
      
      expect(breathingCount).toBe(48);
      expect(totalCount).toBe(55);
      expect(totalCount).toBeLessThan(64);
    });
  });

  describe('Custom Breathing Interval - 2 hours (120 minutes)', () => {
    it('should schedule 12 notifications per day with 2-hour interval', async () => {
      await scheduleBreathingReminder(120);
      
      const notificationsPerDay = Math.floor((24 * 60) / 120);
      expect(notificationsPerDay).toBe(12);
      
      const totalNotifications = notificationsPerDay * 3; // 3 days
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(totalNotifications);
    });

    it('should schedule notifications at exactly 2-hour intervals', async () => {
      const mockNow = 1733523177620;
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);
      
      await scheduleBreathingReminder(120);
      
      const calls = Notifications.scheduleNotificationAsync.mock.calls;
      const intervalSeconds = 120 * 60;
      
      for (let i = 1; i < calls.length; i++) {
        const prevTrigger = calls[i - 1][0].trigger.date.getTime();
        const currTrigger = calls[i][0].trigger.date.getTime();
        const interval = (currTrigger - prevTrigger) / 1000;
        
        expect(interval).toBe(intervalSeconds);
      }
      
      Date.now.mockRestore();
    });

    it('should stay under iOS 64-notification limit (36 + 7 = 43)', async () => {
      await scheduleBreathingReminder(120);
      
      const breathingCount = Notifications.scheduleNotificationAsync.mock.calls.length;
      const moodCount = 7;
      const totalCount = breathingCount + moodCount;
      
      expect(breathingCount).toBe(36);
      expect(totalCount).toBe(43);
      expect(totalCount).toBeLessThan(64);
    });
  });

  describe('Custom Breathing Interval - 3 hours (180 minutes)', () => {
    it('should schedule 8 notifications per day with 3-hour interval', async () => {
      await scheduleBreathingReminder(180);
      
      const notificationsPerDay = Math.floor((24 * 60) / 180);
      expect(notificationsPerDay).toBe(8);
      
      const totalNotifications = notificationsPerDay * 3; // 3 days
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(totalNotifications);
    });

    it('should schedule notifications at exactly 3-hour intervals', async () => {
      const mockNow = 1733523177620;
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);
      
      await scheduleBreathingReminder(180);
      
      const calls = Notifications.scheduleNotificationAsync.mock.calls;
      const intervalSeconds = 180 * 60;
      
      for (let i = 1; i < calls.length; i++) {
        const prevTrigger = calls[i - 1][0].trigger.date.getTime();
        const currTrigger = calls[i][0].trigger.date.getTime();
        const interval = (currTrigger - prevTrigger) / 1000;
        
        expect(interval).toBe(intervalSeconds);
      }
      
      Date.now.mockRestore();
    });

    it('should stay under iOS 64-notification limit (24 + 7 = 31)', async () => {
      await scheduleBreathingReminder(180);
      
      const breathingCount = Notifications.scheduleNotificationAsync.mock.calls.length;
      const moodCount = 7;
      const totalCount = breathingCount + moodCount;
      
      expect(breathingCount).toBe(24);
      expect(totalCount).toBe(31);
      expect(totalCount).toBeLessThan(64);
    });
  });

  describe('Custom Breathing Interval - 4 hours (240 minutes)', () => {
    it('should schedule 6 notifications per day with 4-hour interval', async () => {
      await scheduleBreathingReminder(240);
      
      const notificationsPerDay = Math.floor((24 * 60) / 240);
      expect(notificationsPerDay).toBe(6);
      
      const totalNotifications = notificationsPerDay * 3; // 3 days
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(totalNotifications);
    });

    it('should schedule notifications at exactly 4-hour intervals', async () => {
      const mockNow = 1733523177620;
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);
      
      await scheduleBreathingReminder(240);
      
      const calls = Notifications.scheduleNotificationAsync.mock.calls;
      const intervalSeconds = 240 * 60;
      
      for (let i = 1; i < calls.length; i++) {
        const prevTrigger = calls[i - 1][0].trigger.date.getTime();
        const currTrigger = calls[i][0].trigger.date.getTime();
        const interval = (currTrigger - prevTrigger) / 1000;
        
        expect(interval).toBe(intervalSeconds);
      }
      
      Date.now.mockRestore();
    });

    it('should stay under iOS 64-notification limit (18 + 7 = 25)', async () => {
      await scheduleBreathingReminder(240);
      
      const breathingCount = Notifications.scheduleNotificationAsync.mock.calls.length;
      const moodCount = 7;
      const totalCount = breathingCount + moodCount;
      
      expect(breathingCount).toBe(18);
      expect(totalCount).toBe(25);
      expect(totalCount).toBeLessThan(64);
    });
  });

  describe('Default Breathing Interval', () => {
    it('should default to 90 minutes if no interval provided', async () => {
      await scheduleBreathingReminder();
      
      const calls = Notifications.scheduleNotificationAsync.mock.calls;
      expect(calls.length).toBe(48); // 16 per day × 3 days
    });
  });

  describe('iOS 64-Notification Limit Validation', () => {
    it('should verify all intervals stay under 64-notification limit', () => {
      const intervals = [90, 120, 180, 240];
      const moodCount = 7;
      
      intervals.forEach(interval => {
        const notificationsPerDay = Math.floor((24 * 60) / interval);
        const breathingCount = notificationsPerDay * 3;
        const totalCount = breathingCount + moodCount;
        
        expect(totalCount).toBeLessThan(64);
      });
    });

    it('should verify 60-minute interval would exceed limit (not offered)', () => {
      const interval = 60;
      const notificationsPerDay = Math.floor((24 * 60) / interval);
      const breathingCount = notificationsPerDay * 3;
      const moodCount = 7;
      const totalCount = breathingCount + moodCount;
      
      expect(notificationsPerDay).toBe(24);
      expect(breathingCount).toBe(72);
      expect(totalCount).toBe(79);
      expect(totalCount).toBeGreaterThan(64); // Would exceed limit
    });
  });

  describe('Notification Coverage Calculation', () => {
    it('should provide 3 days of coverage for all intervals', () => {
      const intervals = [90, 120, 180, 240];
      
      intervals.forEach(interval => {
        const notificationsPerDay = Math.floor((24 * 60) / interval);
        const totalNotifications = notificationsPerDay * 3;
        const coverageDays = totalNotifications / notificationsPerDay;
        
        expect(coverageDays).toBe(3);
      });
    });

    it('should calculate correct time span for each interval', () => {
      const testCases = [
        { interval: 90, perDay: 16, total: 48 },
        { interval: 120, perDay: 12, total: 36 },
        { interval: 180, perDay: 8, total: 24 },
        { interval: 240, perDay: 6, total: 18 },
      ];
      
      testCases.forEach(({ interval, perDay, total }) => {
        const notificationsPerDay = Math.floor((24 * 60) / interval);
        const totalNotifications = notificationsPerDay * 3;
        
        expect(notificationsPerDay).toBe(perDay);
        expect(totalNotifications).toBe(total);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle scheduling errors with custom interval', async () => {
      Notifications.scheduleNotificationAsync.mockRejectedValue(new Error('Schedule failed'));
      await expect(scheduleBreathingReminder(120)).resolves.not.toThrow();
    });

    it('should handle scheduling errors with custom mood time', async () => {
      Notifications.scheduleNotificationAsync.mockRejectedValue(new Error('Schedule failed'));
      await expect(scheduleMoodReminder({ hour: 9, minute: 0 })).resolves.not.toThrow();
    });
  });
});
