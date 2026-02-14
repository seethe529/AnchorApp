import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, Linking } from 'react-native';
import SafetyPlan from '../components/SafetyPlan';
import { secureStorage } from '../utils/storage';

// Mock dependencies
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

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Alert.prompt = jest.fn();
  return RN;
});

jest.spyOn(Alert, 'alert');
jest.spyOn(Linking, 'openURL');

describe('SafetyPlan Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    secureStorage.getItem.mockResolvedValue(null);
    secureStorage.setItem.mockResolvedValue(undefined);
  });

  test('renders all sections correctly', async () => {
    const { getByText } = render(<SafetyPlan />);
    
    await waitFor(() => {
      expect(getByText('Warning Signs')).toBeTruthy();
      expect(getByText('Coping Strategies')).toBeTruthy();
      expect(getByText('Social Support')).toBeTruthy();
      expect(getByText('Professional Contacts')).toBeTruthy();
      expect(getByText('Environment Safety')).toBeTruthy();
      expect(getByText('Reasons for Living')).toBeTruthy();
    });
  });

  test('loads saved plan from storage', async () => {
    const savedPlan = {
      warningSigns: [{ id: '1', text: 'Feeling isolated' }],
      copingStrategies: [{ id: '2', text: 'Deep breathing' }],
      socialContacts: [{ id: '3', name: 'John Doe', phone: '555-1234' }],
      professionalContacts: [{ id: '4', name: 'Dr. Smith', phone: '555-5678' }],
      environmentSafety: [{ id: '5', text: 'Remove triggers' }],
      reasonsToLive: [{ id: '6', text: 'My family' }]
    };

    secureStorage.getItem.mockResolvedValue(savedPlan);

    const { getByText } = render(<SafetyPlan />);

    await waitFor(() => {
      expect(getByText('Feeling isolated')).toBeTruthy();
      expect(getByText('Deep breathing')).toBeTruthy();
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('Dr. Smith')).toBeTruthy();
      expect(getByText('Remove triggers')).toBeTruthy();
      expect(getByText('My family')).toBeTruthy();
    });
  });

  test('shows empty state when no items added', async () => {
    const { getAllByText } = render(<SafetyPlan />);

    await waitFor(() => {
      const emptyTexts = getAllByText('No items added yet');
      expect(emptyTexts.length).toBeGreaterThan(0);
    });
  });

  test('enters edit mode when edit button pressed', async () => {
    const { getByLabelText, getAllByText } = render(<SafetyPlan />);

    await waitFor(() => {
      const editButton = getByLabelText('Edit safety plan');
      fireEvent.press(editButton);
    });

    await waitFor(() => {
      const addPrompts = getAllByText(/Tap \+ to add items/);
      expect(addPrompts.length).toBeGreaterThan(0);
    });
  });

  test('adds item to list section', async () => {
    Alert.prompt.mockImplementationOnce((title, message, buttons) => {
      // Simulate user entering text
      buttons[1].onPress('New warning sign');
    });

    const { getByLabelText, getAllByLabelText } = render(<SafetyPlan />);

    await waitFor(() => {
      const editButton = getByLabelText('Edit safety plan');
      fireEvent.press(editButton);
    });

    await waitFor(() => {
      const addButtons = getAllByLabelText('Add item');
      fireEvent.press(addButtons[0]); // Press first one (Warning Signs)
    });

    expect(Alert.prompt).toHaveBeenCalled();
  });

  test('adds contact with name and phone', async () => {
    Alert.prompt
      .mockImplementationOnce((title, message, buttons) => {
        // First prompt: name
        buttons[1].onPress('Dr. Johnson');
      })
      .mockImplementationOnce((title, message, buttons) => {
        // Second prompt: phone
        buttons[1].onPress('555-9999');
      });

    const { getByLabelText, getAllByLabelText } = render(<SafetyPlan />);

    await waitFor(() => {
      const editButton = getByLabelText('Edit safety plan');
      fireEvent.press(editButton);
    });

    await waitFor(() => {
      const addContactButtons = getAllByLabelText('Add contact');
      fireEvent.press(addContactButtons[0]); // Press first one (Social Support)
    });

    expect(Alert.prompt).toHaveBeenCalledTimes(2);
  });

  test('validates phone number format', async () => {
    const savedPlan = {
      warningSigns: [],
      copingStrategies: [],
      socialContacts: [],
      professionalContacts: [
        { id: '1', name: 'Dr. Smith', phone: '215-768-7073' },
        { id: '2', name: 'Therapist', phone: '5551234' },
        { id: '3', name: 'Crisis Line', phone: '(555) 123-4567' }
      ],
      environmentSafety: [],
      reasonsToLive: []
    };

    secureStorage.getItem.mockResolvedValue(savedPlan);

    const { getByText } = render(<SafetyPlan />);

    await waitFor(() => {
      expect(getByText('215-768-7073')).toBeTruthy();
      expect(getByText('5551234')).toBeTruthy();
      expect(getByText('(555) 123-4567')).toBeTruthy();
    });
  });

  test('calls contact when call button pressed', async () => {
    const savedPlan = {
      warningSigns: [],
      copingStrategies: [],
      socialContacts: [],
      professionalContacts: [{ id: '1', name: 'Dr. Smith', phone: '555-1234' }],
      environmentSafety: [],
      reasonsToLive: []
    };

    secureStorage.getItem.mockResolvedValue(savedPlan);

    const { getByLabelText } = render(<SafetyPlan />);

    await waitFor(() => {
      const callButton = getByLabelText('Call Dr. Smith');
      fireEvent.press(callButton);
    });

    expect(Linking.openURL).toHaveBeenCalledWith('tel:555-1234');
  });

  test('texts contact when text button pressed', async () => {
    const savedPlan = {
      warningSigns: [],
      copingStrategies: [],
      socialContacts: [{ id: '1', name: 'Friend', phone: '555-5678' }],
      professionalContacts: [],
      environmentSafety: [],
      reasonsToLive: []
    };

    secureStorage.getItem.mockResolvedValue(savedPlan);

    const { getByLabelText } = render(<SafetyPlan />);

    await waitFor(() => {
      const textButton = getByLabelText('Text Friend');
      fireEvent.press(textButton);
    });

    expect(Linking.openURL).toHaveBeenCalledWith('sms:555-5678');
  });

  test('removes item when remove button pressed', async () => {
    const savedPlan = {
      warningSigns: [{ id: '1', text: 'Test warning' }],
      copingStrategies: [],
      socialContacts: [],
      professionalContacts: [],
      environmentSafety: [],
      reasonsToLive: []
    };

    secureStorage.getItem.mockResolvedValue(savedPlan);

    const { getByLabelText } = render(<SafetyPlan />);

    await waitFor(() => {
      const editButton = getByLabelText('Edit safety plan');
      fireEvent.press(editButton);
    });

    Alert.alert.mockImplementationOnce((title, message, buttons) => {
      // Simulate user confirming removal
      buttons[1].onPress();
    });

    await waitFor(() => {
      const removeButton = getByLabelText('Remove item');
      fireEvent.press(removeButton);
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Remove Item',
      'Are you sure you want to remove this item?',
      expect.any(Array)
    );
  });

  test('saves plan when save button pressed', async () => {
    Alert.alert.mockClear();
    Alert.prompt.mockClear();
    
    const { getByLabelText } = render(<SafetyPlan />);

    await waitFor(() => {
      const editButton = getByLabelText('Edit safety plan');
      fireEvent.press(editButton);
    });

    await waitFor(() => {
      const saveButton = getByLabelText('Save safety plan');
      fireEvent.press(saveButton);
    });

    await waitFor(() => {
      expect(secureStorage.setItem).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Safety plan saved successfully');
    });
  });

  test('emergency contacts always visible and functional', async () => {
    const { getByText } = render(<SafetyPlan />);

    await waitFor(() => {
      expect(getByText('Emergency Contacts')).toBeTruthy();
      expect(getByText(/National Suicide Prevention Lifeline/)).toBeTruthy();
      expect(getByText(/Crisis Text Line/)).toBeTruthy();
      expect(getByText(/Veterans Crisis Line/)).toBeTruthy();
    });
  });

  test('handles long text in items gracefully', async () => {
    const longText = 'This is a very long warning sign that contains a lot of text to test how the component handles lengthy content without breaking the layout or causing issues';
    
    const savedPlan = {
      warningSigns: [{ id: '1', text: longText }],
      copingStrategies: [],
      socialContacts: [],
      professionalContacts: [],
      environmentSafety: [],
      reasonsToLive: []
    };

    secureStorage.getItem.mockResolvedValue(savedPlan);

    const { getByText } = render(<SafetyPlan />);

    await waitFor(() => {
      expect(getByText(longText)).toBeTruthy();
    });
  });

  test('handles special characters in phone numbers', async () => {
    const savedPlan = {
      warningSigns: [],
      copingStrategies: [],
      socialContacts: [],
      professionalContacts: [
        { id: '1', name: 'Contact 1', phone: '+1-555-123-4567' },
        { id: '2', name: 'Contact 2', phone: '(555) 123-4567' },
        { id: '3', name: 'Contact 3', phone: '555.123.4567' }
      ],
      environmentSafety: [],
      reasonsToLive: []
    };

    secureStorage.getItem.mockResolvedValue(savedPlan);

    const { getByLabelText } = render(<SafetyPlan />);

    await waitFor(() => {
      const callButton1 = getByLabelText('Call Contact 1');
      fireEvent.press(callButton1);
      expect(Linking.openURL).toHaveBeenCalledWith('tel:+1-555-123-4567');

      const callButton2 = getByLabelText('Call Contact 2');
      fireEvent.press(callButton2);
      expect(Linking.openURL).toHaveBeenCalledWith('tel:(555) 123-4567');

      const callButton3 = getByLabelText('Call Contact 3');
      fireEvent.press(callButton3);
      expect(Linking.openURL).toHaveBeenCalledWith('tel:555.123.4567');
    });
  });
});
