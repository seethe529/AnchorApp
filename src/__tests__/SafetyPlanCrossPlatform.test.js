import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Platform, Alert } from 'react-native';
import SafetyPlan from '../components/SafetyPlan';
import { secureStorage } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

jest.mock('../utils/storage');
jest.mock('../context/ThemeContext', () => ({
  useTheme: jest.fn()
}));
jest.mock('@react-navigation/native', () => ({
  useIsFocused: () => true
}));

const mockTheme = {
  background: '#000',
  card: '#111',
  text: '#fff',
  textSecondary: '#aaa',
  textTertiary: '#666',
  primary: '#2E8B57'
};

describe('SafetyPlan - Cross-Platform Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useTheme.mockReturnValue({ theme: mockTheme });
    secureStorage.getItem.mockResolvedValue(null);
    secureStorage.setItem.mockResolvedValue(true);
  });

  describe('Android Modal Functionality', () => {
    beforeEach(() => {
      Platform.OS = 'android';
    });

    test('opens modal when adding item on Android', async () => {
      const { getByText, getByPlaceholderText } = render(<SafetyPlan />);
      
      await waitFor(() => expect(getByText('Personal Safety Plan')).toBeTruthy());
      
      fireEvent.press(getByText('Edit safety plan'));
      fireEvent.press(getByText('Add Item'));
      
      await waitFor(() => {
        expect(getByText('Add Item')).toBeTruthy();
        expect(getByPlaceholderText('Enter item')).toBeTruthy();
      });
    });

    test('adds item through modal on Android', async () => {
      const { getByText, getByPlaceholderText, queryByText } = render(<SafetyPlan />);
      
      await waitFor(() => expect(getByText('Personal Safety Plan')).toBeTruthy());
      
      fireEvent.press(getByText('Edit safety plan'));
      fireEvent.press(getByText('Add Item'));
      
      const input = getByPlaceholderText('Enter item');
      fireEvent.changeText(input, 'Test warning sign');
      fireEvent.press(getByText('Add'));
      
      await waitFor(() => {
        expect(queryByText('Add Item')).toBeNull();
        expect(getByText('Test warning sign')).toBeTruthy();
      });
    });

    test('opens contact modal on Android', async () => {
      const { getAllByText, getByPlaceholderText } = render(<SafetyPlan />);
      
      await waitFor(() => expect(getAllByText('Personal Safety Plan')[0]).toBeTruthy());
      
      fireEvent.press(getAllByText('Edit safety plan')[0]);
      fireEvent.press(getAllByText('Add Contact')[0]);
      
      await waitFor(() => {
        expect(getAllByText('Add Contact')[0]).toBeTruthy();
        expect(getByPlaceholderText('Enter name')).toBeTruthy();
      });
    });

    test('adds contact through two-step modal on Android', async () => {
      const { getAllByText, getByPlaceholderText, getByText } = render(<SafetyPlan />);
      
      await waitFor(() => expect(getAllByText('Personal Safety Plan')[0]).toBeTruthy());
      
      fireEvent.press(getAllByText('Edit safety plan')[0]);
      fireEvent.press(getAllByText('Add Contact')[0]);
      
      // Step 1: Enter name
      const nameInput = getByPlaceholderText('Enter name');
      fireEvent.changeText(nameInput, 'John Doe');
      fireEvent.press(getByText('Next'));
      
      // Step 2: Enter phone
      await waitFor(() => {
        expect(getByPlaceholderText('Enter phone number')).toBeTruthy();
      });
      
      const phoneInput = getByPlaceholderText('Enter phone number');
      fireEvent.changeText(phoneInput, '1234567890');
      fireEvent.press(getAllByText('Add')[0]);
      
      await waitFor(() => {
        expect(getByText('John Doe')).toBeTruthy();
        expect(getByText('123-456-7890')).toBeTruthy();
      });
    });

    test('cancels modal on Android', async () => {
      const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(<SafetyPlan />);
      
      await waitFor(() => expect(getByText('Personal Safety Plan')).toBeTruthy());
      
      fireEvent.press(getByText('Edit safety plan'));
      fireEvent.press(getByText('Add Item'));
      
      expect(getByPlaceholderText('Enter item')).toBeTruthy();
      
      fireEvent.press(getByText('Cancel'));
      
      await waitFor(() => {
        expect(queryByPlaceholderText('Enter item')).toBeNull();
      });
    });

    test('formats phone number in modal on Android', async () => {
      const { getAllByText, getByPlaceholderText, getByText } = render(<SafetyPlan />);
      
      await waitFor(() => expect(getAllByText('Personal Safety Plan')[0]).toBeTruthy());
      
      fireEvent.press(getAllByText('Edit safety plan')[0]);
      fireEvent.press(getAllByText('Add Contact')[0]);
      
      const nameInput = getByPlaceholderText('Enter name');
      fireEvent.changeText(nameInput, 'Jane');
      fireEvent.press(getByText('Next'));
      
      await waitFor(() => {
        const phoneInput = getByPlaceholderText('Enter phone number');
        fireEvent.changeText(phoneInput, '555-123-4567');
        fireEvent.press(getAllByText('Add')[0]);
      });
      
      await waitFor(() => {
        expect(getByText('555-123-4567')).toBeTruthy();
      });
    });
  });

  describe('iOS Alert.prompt Functionality', () => {
    beforeEach(() => {
      Platform.OS = 'ios';
      jest.spyOn(Alert, 'prompt').mockImplementation((title, message, buttons) => {
        // Simulate user entering text and pressing Add
        if (buttons && buttons[1] && buttons[1].onPress) {
          buttons[1].onPress('Test item');
        }
      });
    });

    test('uses Alert.prompt on iOS for items', async () => {
      const { getByText } = render(<SafetyPlan />);
      
      await waitFor(() => expect(getByText('Personal Safety Plan')).toBeTruthy());
      
      fireEvent.press(getByText('Edit safety plan'));
      fireEvent.press(getByText('Add Item'));
      
      expect(Alert.prompt).toHaveBeenCalledWith(
        'Add Item',
        expect.any(String),
        expect.any(Array),
        'plain-text'
      );
    });

    test('uses Alert.prompt on iOS for contacts', async () => {
      const { getAllByText } = render(<SafetyPlan />);
      
      await waitFor(() => expect(getAllByText('Personal Safety Plan')[0]).toBeTruthy());
      
      fireEvent.press(getAllByText('Edit safety plan')[0]);
      fireEvent.press(getAllByText('Add Contact')[0]);
      
      expect(Alert.prompt).toHaveBeenCalledWith(
        'Add Contact',
        'Enter name',
        expect.any(Array),
        'plain-text'
      );
    });
  });

  describe('Modal State Management', () => {
    beforeEach(() => {
      Platform.OS = 'android';
    });

    test('resets modal state on cancel', async () => {
      const { getByText, getByPlaceholderText, queryByPlaceholderText } = render(<SafetyPlan />);
      
      await waitFor(() => expect(getByText('Personal Safety Plan')).toBeTruthy());
      
      fireEvent.press(getByText('Edit safety plan'));
      fireEvent.press(getByText('Add Item'));
      
      const input = getByPlaceholderText('Enter item');
      fireEvent.changeText(input, 'Some text');
      fireEvent.press(getByText('Cancel'));
      
      await waitFor(() => {
        expect(queryByPlaceholderText('Enter item')).toBeNull();
      });
      
      // Open again and verify it's empty
      fireEvent.press(getByText('Add Item'));
      
      await waitFor(() => {
        const newInput = getByPlaceholderText('Enter item');
        expect(newInput.props.value).toBe('');
      });
    });

    test('clears temp contact name on cancel during phone entry', async () => {
      const { getAllByText, getByPlaceholderText, getByText, queryByPlaceholderText } = render(<SafetyPlan />);
      
      await waitFor(() => expect(getAllByText('Personal Safety Plan')[0]).toBeTruthy());
      
      fireEvent.press(getAllByText('Edit safety plan')[0]);
      fireEvent.press(getAllByText('Add Contact')[0]);
      
      const nameInput = getByPlaceholderText('Enter name');
      fireEvent.changeText(nameInput, 'John');
      fireEvent.press(getByText('Next'));
      
      await waitFor(() => {
        expect(getByPlaceholderText('Enter phone number')).toBeTruthy();
      });
      
      fireEvent.press(getByText('Cancel'));
      
      await waitFor(() => {
        expect(queryByPlaceholderText('Enter phone number')).toBeNull();
      });
    });
  });

  describe('Phone Number Formatting', () => {
    beforeEach(() => {
      Platform.OS = 'android';
    });

    test('formats 10-digit phone number', async () => {
      const { getAllByText, getByPlaceholderText, getByText } = render(<SafetyPlan />);
      
      await waitFor(() => expect(getAllByText('Personal Safety Plan')[0]).toBeTruthy());
      
      fireEvent.press(getAllByText('Edit safety plan')[0]);
      fireEvent.press(getAllByText('Add Contact')[0]);
      
      fireEvent.changeText(getByPlaceholderText('Enter name'), 'Test');
      fireEvent.press(getByText('Next'));
      
      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Enter phone number'), '5551234567');
        fireEvent.press(getAllByText('Add')[0]);
      });
      
      await waitFor(() => {
        expect(getByText('555-123-4567')).toBeTruthy();
      });
    });

    test('formats 11-digit phone number with country code', async () => {
      const { getAllByText, getByPlaceholderText, getByText } = render(<SafetyPlan />);
      
      await waitFor(() => expect(getAllByText('Personal Safety Plan')[0]).toBeTruthy());
      
      fireEvent.press(getAllByText('Edit safety plan')[0]);
      fireEvent.press(getAllByText('Add Contact')[0]);
      
      fireEvent.changeText(getByPlaceholderText('Enter name'), 'Test');
      fireEvent.press(getByText('Next'));
      
      await waitFor(() => {
        fireEvent.changeText(getByPlaceholderText('Enter phone number'), '15551234567');
        fireEvent.press(getAllByText('Add')[0]);
      });
      
      await waitFor(() => {
        expect(getByText('1-555-123-4567')).toBeTruthy();
      });
    });
  });
});
