import { dailyReminders, getRandomReminder, getDailyReminder } from '../data/dailyReminders';

describe('Daily Reminders', () => {
  test('should have reminders defined', () => {
    expect(dailyReminders).toBeDefined();
    expect(dailyReminders.length).toBeGreaterThan(30);
  });

  test('should return a random reminder', () => {
    const reminder = getRandomReminder();
    expect(typeof reminder).toBe('string');
    expect(reminder.length).toBeGreaterThan(0);
  });

  test('should return a daily reminder', () => {
    const reminder = getDailyReminder();
    expect(typeof reminder).toBe('string');
    expect(dailyReminders).toContain(reminder);
  });

  test('should return same reminder for same day', () => {
    const reminder1 = getDailyReminder();
    const reminder2 = getDailyReminder();
    expect(reminder1).toBe(reminder2);
  });
});
