import { AppState } from 'react-native';
import { scheduleBreathingReminder, scheduleMoodReminder, cancelBreathingReminder, cancelMoodReminder } from '../utils/notifications';
import { storage } from '../utils/storage';

jest.mock('../utils/notifications');
jest.mock('../utils/storage');

describe.skip('Android AppState Notification Workflow', () => {
  let appStateListener;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Capture the AppState listener
    AppState.addEventListener = jest.fn((event, callback) => {
      appStateListener = callback;
      return { remove: jest.fn() };
    });
  });

  it('should NOT reschedule when opening app on same day', async () => {
    const currentDate = 6;
    storage.getItem.mockImplementation((key) => {
      if (key === 'last_reset') return Promise.resolve(currentDate);
      if (key === 'user_preferences') return Promise.resolve({ breathingReminders: true, moodReminders: true });
      return Promise.resolve(null);
    });

    // Simulate app going to background then foreground
    await appStateListener('background');
    await appStateListener('active');

    expect(cancelBreathingReminder).not.toHaveBeenCalled();
    expect(cancelMoodReminder).not.toHaveBeenCalled();
    expect(scheduleBreathingReminder).not.toHaveBeenCalled();
    expect(scheduleMoodReminder).not.toHaveBeenCalled();
  });

  it('should reschedule when opening app on new day', async () => {
    const oldDate = 5;
    const newDate = 6;
    
    storage.getItem.mockImplementation((key) => {
      if (key === 'last_reset') return Promise.resolve(oldDate);
      if (key === 'user_preferences') return Promise.resolve({ breathingReminders: true, moodReminders: true });
      return Promise.resolve(null);
    });

    // Mock Date to return new day
    const mockDate = new Date('2025-12-06T10:00:00');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    await appStateListener('active');

    expect(cancelBreathingReminder).toHaveBeenCalledTimes(1);
    expect(cancelMoodReminder).toHaveBeenCalledTimes(1);
    expect(scheduleBreathingReminder).toHaveBeenCalledTimes(1);
    expect(scheduleMoodReminder).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith('last_reset', newDate);

    global.Date.mockRestore();
  });

  it('should respect 5-minute debounce when opening app multiple times', async () => {
    const currentDate = 6;
    storage.getItem.mockImplementation((key) => {
      if (key === 'last_reset') return Promise.resolve(currentDate);
      if (key === 'user_preferences') return Promise.resolve({ breathingReminders: true, moodReminders: true });
      return Promise.resolve(null);
    });

    // First open
    await appStateListener('active');
    const firstCallCount = storage.getItem.mock.calls.length;
    
    // Second open immediately (should be debounced)
    await appStateListener('active');

    // Should not make additional calls due to debounce
    expect(storage.getItem.mock.calls.length).toBe(firstCallCount);
  });

  it('should NOT reschedule if notifications are disabled', async () => {
    const oldDate = 5;
    
    storage.getItem.mockImplementation((key) => {
      if (key === 'last_reset') return Promise.resolve(oldDate);
      if (key === 'user_preferences') return Promise.resolve({ breathingReminders: false, moodReminders: false });
      return Promise.resolve(null);
    });

    const mockDate = new Date('2025-12-06T10:00:00');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    await appStateListener('active');

    expect(cancelBreathingReminder).toHaveBeenCalledTimes(1);
    expect(cancelMoodReminder).toHaveBeenCalledTimes(1);
    expect(scheduleBreathingReminder).not.toHaveBeenCalled();
    expect(scheduleMoodReminder).not.toHaveBeenCalled();

    global.Date.mockRestore();
  });

  it('should handle user opening app during PTSD episode gracefully', async () => {
    // User opens app multiple times in distress
    const currentDate = 6;
    storage.getItem.mockImplementation((key) => {
      if (key === 'last_reset') return Promise.resolve(currentDate);
      if (key === 'user_preferences') return Promise.resolve({ breathingReminders: true, moodReminders: true });
      return Promise.resolve(null);
    });

    // Rapid app opens (panic/distress behavior)
    await appStateListener('active');
    await appStateListener('background');
    await appStateListener('active');
    await appStateListener('background');
    await appStateListener('active');

    // Should only trigger once due to debounce (no notification spam)
    expect(storage.getItem).toHaveBeenCalledTimes(2); // Only first call
  });
});
