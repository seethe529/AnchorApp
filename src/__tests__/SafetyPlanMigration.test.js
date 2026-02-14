import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import SafetyPlan from '../components/SafetyPlan';
import { secureStorage } from '../utils/storage';

jest.mock('../utils/storage', () => ({
  secureStorage: {
    getItem: jest.fn(),
    setItem: jest.fn()
  },
  STORAGE_KEYS: {
    SAFETY_PLAN: 'safety_plan'
  }
}));

jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => true
}));

jest.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      background: '#fff',
      card: '#f5f5f5',
      text: '#000',
      textSecondary: '#666',
      textTertiary: '#999',
      primary: '#2E8B57',
      border: '#ddd'
    }
  })
}));

describe('SafetyPlan Migration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    secureStorage.setItem.mockResolvedValue(undefined);
  });

  test('migrates old string format to new array format', async () => {
    const oldFormat = {
      warningSigns: 'Feeling isolated\nWithdrawing from friends\nSleeping too much',
      copingStrategies: 'Deep breathing\nCall a friend\nGo for a walk',
      socialContacts: 'John Doe - 555-1234\nJane Smith - 555-5678',
      professionalContacts: 'Dr. Johnson - 555-9999\nTherapist - 555-0000',
      environmentSafety: 'Remove triggers\nCreate safe space',
      reasonsToLive: 'My family\nMy pets\nMy future goals'
    };

    secureStorage.getItem.mockResolvedValue(oldFormat);

    const { getByText } = render(<SafetyPlan />);

    await waitFor(() => {
      // Check that old data is preserved and parsed correctly
      expect(getByText('Feeling isolated')).toBeTruthy();
      expect(getByText('Withdrawing from friends')).toBeTruthy();
      expect(getByText('Deep breathing')).toBeTruthy();
      // Contacts are parsed into name/phone
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('555-1234')).toBeTruthy();
      expect(getByText('Dr. Johnson')).toBeTruthy();
      expect(getByText('555-9999')).toBeTruthy();
      expect(getByText('Remove triggers')).toBeTruthy();
      expect(getByText('My family')).toBeTruthy();
    });

    // Verify migration was saved
    await waitFor(() => {
      expect(secureStorage.setItem).toHaveBeenCalledWith(
        'safety_plan',
        expect.objectContaining({
          warningSigns: expect.arrayContaining([
            expect.objectContaining({ text: 'Feeling isolated' })
          ]),
          copingStrategies: expect.arrayContaining([
            expect.objectContaining({ text: 'Deep breathing' })
          ])
        })
      );
    });
  });

  test('handles empty strings in old format', async () => {
    const oldFormat = {
      warningSigns: '',
      copingStrategies: 'Deep breathing',
      socialContacts: '',
      professionalContacts: '',
      environmentSafety: '',
      reasonsToLive: ''
    };

    secureStorage.getItem.mockResolvedValue(oldFormat);

    const { getByText } = render(<SafetyPlan />);

    await waitFor(() => {
      expect(getByText('Deep breathing')).toBeTruthy();
    });
  });

  test('preserves new array format without migration', async () => {
    const newFormat = {
      warningSigns: [{ id: '1', text: 'Test warning' }],
      copingStrategies: [{ id: '2', text: 'Test strategy' }],
      socialContacts: [{ id: '3', name: 'John', phone: '555-1234' }],
      professionalContacts: [],
      environmentSafety: [],
      reasonsToLive: []
    };

    secureStorage.getItem.mockResolvedValue(newFormat);

    const { getByText } = render(<SafetyPlan />);

    await waitFor(() => {
      expect(getByText('Test warning')).toBeTruthy();
      expect(getByText('Test strategy')).toBeTruthy();
      expect(getByText('John')).toBeTruthy();
    });

    // Should NOT save again (no migration needed)
    expect(secureStorage.setItem).not.toHaveBeenCalled();
  });

  test('handles mixed format (some strings, some arrays)', async () => {
    const mixedFormat = {
      warningSigns: 'Old string data',
      copingStrategies: [{ id: '1', text: 'New array data' }],
      socialContacts: '',
      professionalContacts: [],
      environmentSafety: 'Another old string',
      reasonsToLive: []
    };

    secureStorage.getItem.mockResolvedValue(mixedFormat);

    const { getByText } = render(<SafetyPlan />);

    await waitFor(() => {
      expect(getByText('Old string data')).toBeTruthy();
      expect(getByText('New array data')).toBeTruthy();
      expect(getByText('Another old string')).toBeTruthy();
    });

    // Should save migrated version
    await waitFor(() => {
      expect(secureStorage.setItem).toHaveBeenCalled();
    });
  });
});
