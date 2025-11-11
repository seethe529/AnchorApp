import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import ProgressScreen from '../screens/ProgressScreen';
import { storage, STORAGE_KEYS } from '../utils/storage';

jest.mock('../utils/storage', () => ({
  storage: {
    getItem: jest.fn(),
  },
  STORAGE_KEYS: {
    MOOD_LOGS: 'mood_logs',
    TECHNIQUE_USAGE: 'technique_usage',
  },
}));

describe('ProgressScreen', () => {
  const mockNavigation = {
    addListener: jest.fn((event, callback) => {
      return jest.fn();
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    storage.getItem.mockResolvedValue([]);
    const { getByText } = render(<ProgressScreen navigation={mockNavigation} />);
    expect(getByText('Loading progress data...')).toBeTruthy();
  });

  it('displays title after loading', async () => {
    storage.getItem.mockResolvedValue([]);
    const { getByText } = render(<ProgressScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getByText('Your Progress')).toBeTruthy();
    });
  });

  it('shows no data message when no mood logs exist', async () => {
    storage.getItem.mockResolvedValue([]);
    const { getByText } = render(<ProgressScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getByText('No mood data available yet')).toBeTruthy();
      expect(getByText('Start logging your mood to see trends')).toBeTruthy();
    });
  });

  it('shows no data message when no technique usage exists', async () => {
    storage.getItem.mockResolvedValue([]);
    const { getByText } = render(<ProgressScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getByText('No technique usage data yet')).toBeTruthy();
      expect(getByText('Use techniques to see your patterns')).toBeTruthy();
    });
  });

  it('displays Quick Stats section', async () => {
    storage.getItem.mockResolvedValue([]);
    const { getByText } = render(<ProgressScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getByText('Quick Stats')).toBeTruthy();
      expect(getByText('Total Mood Logs:')).toBeTruthy();
      expect(getByText('Techniques Used:')).toBeTruthy();
      expect(getByText('Average Mood:')).toBeTruthy();
    });
  });

  it('calculates total mood logs correctly', async () => {
    const mockMoodLogs = [
      { date: new Date().toDateString(), mood: 4 },
      { date: new Date().toDateString(), mood: 3 },
      { date: new Date().toDateString(), mood: 5 },
    ];
    
    storage.getItem.mockImplementation((key) => {
      if (key === STORAGE_KEYS.MOOD_LOGS) return Promise.resolve(mockMoodLogs);
      return Promise.resolve([]);
    });
    
    const { getByText } = render(<ProgressScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getByText('3')).toBeTruthy();
    });
  });

  it('calculates average mood correctly', async () => {
    const today = new Date().toDateString();
    const mockMoodLogs = [
      { date: today, mood: 4 },
      { date: today, mood: 2 },
    ];
    
    storage.getItem.mockImplementation((key) => {
      if (key === STORAGE_KEYS.MOOD_LOGS) return Promise.resolve(mockMoodLogs);
      return Promise.resolve([]);
    });
    
    const { getByText } = render(<ProgressScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getByText('3.0')).toBeTruthy();
    });
  });

  it('displays chart titles', async () => {
    storage.getItem.mockResolvedValue([]);
    const { getByText } = render(<ProgressScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getByText('Mood Trend (Last 7 Days)')).toBeTruthy();
      expect(getByText('Most Used Techniques')).toBeTruthy();
    });
  });

  it('processes technique usage data correctly', async () => {
    const mockTechniqueUsage = [
      { technique: 'Box Breathing', effectiveness: 5 },
      { technique: 'Box Breathing', effectiveness: 4 },
      { technique: 'Grounding', effectiveness: 3 },
    ];
    
    storage.getItem.mockImplementation((key) => {
      if (key === STORAGE_KEYS.TECHNIQUE_USAGE) return Promise.resolve(mockTechniqueUsage);
      return Promise.resolve([]);
    });
    
    const { getByText } = render(<ProgressScreen navigation={mockNavigation} />);
    
    await waitFor(() => {
      expect(getByText('3')).toBeTruthy();
    });
  });

  it('registers focus listener for auto-refresh', () => {
    storage.getItem.mockResolvedValue([]);
    render(<ProgressScreen navigation={mockNavigation} />);
    
    expect(mockNavigation.addListener).toHaveBeenCalledWith('focus', expect.any(Function));
  });
});
