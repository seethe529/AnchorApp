import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MoodTracker from '../components/MoodTracker';
import { storage } from '../utils/storage';

jest.mock('../utils/storage');
jest.mock('../utils/appRating', () => ({
  trackMoodLog: jest.fn()
}));

describe('MoodTracker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getItem.mockResolvedValue([]);
    storage.setItem.mockResolvedValue(true);
  });

  it('renders mood options', () => {
    const { getByText } = render(<MoodTracker />);
    expect(getByText('Excellent')).toBeTruthy();
    expect(getByText('Good')).toBeTruthy();
    expect(getByText('Okay')).toBeTruthy();
    expect(getByText('Poor')).toBeTruthy();
    expect(getByText('Terrible')).toBeTruthy();
  });

  it('shows notes section when mood is selected', () => {
    const { getByText, queryByText } = render(<MoodTracker />);
    
    expect(queryByText('Log Mood')).toBeNull();
    
    fireEvent.press(getByText('Good'));
    
    expect(getByText('Log Mood')).toBeTruthy();
  });

  it('logs mood correctly', async () => {
    const onMoodLogged = jest.fn();
    const { getByText } = render(<MoodTracker onMoodLogged={onMoodLogged} />);
    
    fireEvent.press(getByText('Good'));
    fireEvent.press(getByText('Log Mood'));
    
    await waitFor(() => {
      expect(storage.setItem).toHaveBeenCalled();
      const savedData = storage.setItem.mock.calls[0][1];
      expect(savedData[0].mood).toBe(4);
      expect(savedData[0].moodName).toBe('Good');
      expect(savedData[0].date).toBeTruthy();
    });
  });

  it('prepends new mood to existing logs', async () => {
    const existingLogs = [
      { mood: 3, moodName: 'Okay', date: 'Mon Nov 10 2025' }
    ];
    storage.getItem.mockResolvedValue(existingLogs);
    
    const { getByText } = render(<MoodTracker />);
    
    fireEvent.press(getByText('Good'));
    fireEvent.press(getByText('Log Mood'));
    
    await waitFor(() => {
      const savedData = storage.setItem.mock.calls[0][1];
      expect(savedData.length).toBe(2);
      expect(savedData[0].mood).toBe(4); // New entry first
      expect(savedData[1].mood).toBe(3); // Old entry second
    });
  });

  it('includes notes when provided', async () => {
    const { getByText, getByPlaceholderText } = render(<MoodTracker />);
    
    fireEvent.press(getByText('Excellent'));
    fireEvent.changeText(getByPlaceholderText("What's on your mind?"), 'Feeling great today!');
    fireEvent.press(getByText('Log Mood'));
    
    await waitFor(() => {
      const savedData = storage.setItem.mock.calls[0][1];
      expect(savedData[0].notes).toBe('Feeling great today!');
    });
  });

  it('clears selection after logging', async () => {
    const { getByText, queryByText } = render(<MoodTracker />);
    
    fireEvent.press(getByText('Good'));
    expect(getByText('Log Mood')).toBeTruthy();
    
    fireEvent.press(getByText('Log Mood'));
    
    await waitFor(() => {
      expect(queryByText('Log Mood')).toBeNull();
    });
  });
});
