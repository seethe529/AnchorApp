import { shouldResetNotifications, getReschedulePlan } from '../utils/notifications';

// App.js drives its iOS/Android reschedule-on-foreground logic entirely
// through these two pure functions, so testing them directly exercises the
// real decision logic without needing to mount the full App component tree.
describe('shouldResetNotifications', () => {
  it('should NOT reset when opening the app on the same day', () => {
    const now = new Date('2026-01-06T10:00:00');
    expect(shouldResetNotifications(now.toDateString(), now)).toBe(false);
  });

  it('should reset when opening the app on a new day', () => {
    const last = new Date('2026-01-05T22:00:00').toDateString();
    const now = new Date('2026-01-06T08:00:00');
    expect(shouldResetNotifications(last, now)).toBe(true);
  });

  it('should reset across a same day-of-month collision a month apart', () => {
    // Regression test: the old implementation compared getDate() only, so
    // opening on the 15th of one month and again on the 15th of the next
    // month looked like "no change" and silently skipped rescheduling.
    const last = new Date('2026-01-15T09:00:00').toDateString();
    const now = new Date('2026-02-15T09:00:00');
    expect(shouldResetNotifications(last, now)).toBe(true);
  });

  it('should reset when there is no stored last_reset value yet', () => {
    const now = new Date('2026-01-06T10:00:00');
    expect(shouldResetNotifications('', now)).toBe(true);
  });
});

describe('getReschedulePlan', () => {
  it('should schedule both when notifications and both reminders are enabled', () => {
    const plan = getReschedulePlan({ notifications: true, breathingReminders: true, moodReminders: true });
    expect(plan).toEqual({ breathing: true, mood: true });
  });

  it('should schedule neither when the master notifications toggle is off', () => {
    // Regression test: previously the reschedule path only checked the
    // sub-preference flags, so disabling "Enable Notifications" did not stop
    // reminders from being silently rescheduled on the next day change.
    const plan = getReschedulePlan({ notifications: false, breathingReminders: true, moodReminders: true });
    expect(plan).toEqual({ breathing: false, mood: false });
  });

  it('should respect individual reminder toggles when notifications are enabled', () => {
    const plan = getReschedulePlan({ notifications: true, breathingReminders: true, moodReminders: false });
    expect(plan).toEqual({ breathing: true, mood: false });
  });

  it('should default to neither scheduled when preferences are missing', () => {
    expect(getReschedulePlan()).toEqual({ breathing: false, mood: false });
    expect(getReschedulePlan({})).toEqual({ breathing: false, mood: false });
  });
});
