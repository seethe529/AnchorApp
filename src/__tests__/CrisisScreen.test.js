import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert, Linking } from 'react-native';
import CrisisScreen from '../screens/CrisisScreen';

jest.spyOn(Alert, 'alert');
jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

jest.mock('../utils/storage', () => ({
  secureStorage: {
    getItem: jest.fn(() => Promise.resolve([])),
  },
  STORAGE_KEYS: {
    EMERGENCY_CONTACTS: 'emergency_contacts',
  },
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(() => Promise.resolve({
    coords: { latitude: 37.7749, longitude: -122.4194 }
  })),
}));

describe('CrisisScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders warning banner correctly', () => {
    const { getByText } = render(<CrisisScreen navigation={{}} />);
    expect(getByText('Immediate danger? Call 911')).toBeTruthy();
  });

  it('displays all crisis resources', () => {
    const { getByText } = render(<CrisisScreen navigation={{}} />);
    
    expect(getByText('National Suicide Prevention Lifeline')).toBeTruthy();
    expect(getByText('Crisis Text Line')).toBeTruthy();
    expect(getByText('Veterans Crisis Line')).toBeTruthy();
    expect(getByText('SAMHSA National Helpline')).toBeTruthy();
  });

  it('displays immediate help options', () => {
    const { getByText } = render(<CrisisScreen navigation={{}} />);
    
    expect(getByText('Call 911')).toBeTruthy();
    expect(getByText('Go to ER')).toBeTruthy();
    expect(getByText('Call Crisis Line')).toBeTruthy();
  });

  it('shows alert when calling crisis line', () => {
    const { getByText } = render(<CrisisScreen navigation={{}} />);
    
    const crisisLineButton = getByText('National Suicide Prevention Lifeline');
    fireEvent.press(crisisLineButton);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Call Crisis Support',
      expect.stringContaining('National Suicide Prevention Lifeline'),
      expect.any(Array)
    );
  });

  it('opens SMS for Crisis Text Line', () => {
    const { getByText } = render(<CrisisScreen navigation={{}} />);
    
    const textLineButton = getByText('Crisis Text Line');
    fireEvent.press(textLineButton);
    
    expect(Linking.openURL).toHaveBeenCalledWith('sms:741741&body=HOME');
  });

  it('displays local resources section', () => {
    const { getByText } = render(<CrisisScreen navigation={{}} />);
    
    expect(getByText('Find Local Crisis Centers')).toBeTruthy();
    expect(getByText('Hospital Emergency Room')).toBeTruthy();
  });

  it('displays safety reminders', () => {
    const { getByText } = render(<CrisisScreen navigation={{}} />);
    
    expect(getByText(/Remove any means of self-harm/)).toBeTruthy();
    expect(getByText(/Call a trusted friend/)).toBeTruthy();
    expect(getByText(/This feeling is temporary/)).toBeTruthy();
  });

  it('displays View My Safety Plan button', () => {
    const { getByText } = render(<CrisisScreen navigation={{}} />);
    expect(getByText('View My Safety Plan')).toBeTruthy();
  });

  it('displays footer message', () => {
    const { getByText } = render(<CrisisScreen navigation={{}} />);
    expect(getByText(/You are not alone/)).toBeTruthy();
    expect(getByText(/Your life has value and meaning/)).toBeTruthy();
  });

  it('has proper accessibility labels for crisis resources', () => {
    const { getByLabelText } = render(<CrisisScreen navigation={{}} />);
    
    expect(getByLabelText(/National Suicide Prevention Lifeline/)).toBeTruthy();
    expect(getByLabelText(/Crisis Text Line/)).toBeTruthy();
  });
});
