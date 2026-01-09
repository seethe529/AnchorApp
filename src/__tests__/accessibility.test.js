import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import BreathingScreen from '../screens/BreathingScreen';
import ToolsScreen from '../screens/ToolsScreen';
import AIAgentScreen from '../screens/AIAgentScreen';
import CrisisScreen from '../screens/CrisisScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';

const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
};

jest.mock('../utils/storage');
jest.mock('../utils/notifications');
jest.mock('../utils/appRating', () => ({
  trackMoodLog: jest.fn(),
  trackTechniqueUsed: jest.fn(),
}));

describe('Accessibility Tests', () => {
  describe('BreathingScreen', () => {
    it('should have only visible breathing circle accessible', () => {
      const { UNSAFE_getAllByType } = render(<BreathingScreen navigation={mockNavigation} />);
      const animatedViews = UNSAFE_getAllByType(require('react-native').Animated.View);
      
      const breathingCircles = animatedViews.filter(view => 
        view.props.accessibilityLabel?.includes('breathing circle')
      );
      
      const accessibleCircles = breathingCircles.filter(circle => circle.props.accessible === true);
      expect(accessibleCircles.length).toBe(1);
    });
  });

  describe('HomeScreen', () => {
    it('should have header with accessibility role', async () => {
      const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        const title = getByText('Welcome to Anchor');
        expect(title.props.accessibilityRole).toBe('header');
      });
    });

    it('should have accessible quick action buttons', async () => {
      const { getByLabelText } = render(<HomeScreen navigation={mockNavigation} />);
      await waitFor(() => {
        expect(getByLabelText('Quick Grounding')).toBeTruthy();
        expect(getByLabelText('Crisis Help')).toBeTruthy();
      });
    });
  });

  describe('CrisisScreen', () => {
    it('should have warning banner with alert role', async () => {
      const { getByRole } = render(<CrisisScreen navigation={mockNavigation} />);
      await waitFor(() => {
        const alert = getByRole('alert');
        expect(alert.props.accessibilityLabel).toContain('911');
      });
    });

    it('should have section headers', async () => {
      const { getAllByRole } = render(<CrisisScreen navigation={mockNavigation} />);
      await waitFor(() => {
        const headers = getAllByRole('header');
        expect(headers.length).toBeGreaterThan(0);
      });
    });
  });

  describe('ProgressScreen', () => {
    it('should have main title with header role', async () => {
      const { getByText } = render(<ProgressScreen navigation={mockNavigation} />);
      await waitFor(() => {
        const title = getByText('Your Progress');
        expect(title.props.accessibilityRole).toBe('header');
      });
    });

    it('should have accessible toggle button', async () => {
      const { getByRole } = render(<ProgressScreen navigation={mockNavigation} />);
      await waitFor(() => {
        const toggle = getByRole('switch');
        expect(toggle.props.accessibilityState).toBeDefined();
      });
    });
  });

  describe('SettingsScreen', () => {
    it('should have accessible switches', async () => {
      const { getAllByRole } = render(<SettingsScreen navigation={mockNavigation} />);
      await waitFor(() => {
        const switches = getAllByRole('switch');
        
        switches.forEach(switchElement => {
          expect(switchElement.props.accessibilityLabel).toBeTruthy();
          expect(switchElement.props.accessibilityState).toBeDefined();
        });
      });
    });
  });
});
