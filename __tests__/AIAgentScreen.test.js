import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AIAgentScreen from '../src/screens/AIAgentScreen';
import { sendMessageToOpenAI } from '../src/services/openai';
import { storage } from '../src/utils/storage';

jest.mock('../src/services/openai');
jest.mock('../src/utils/storage');
jest.mock('../src/utils/errorLogger', () => ({
  log: jest.fn(),
  logStorageError: jest.fn(),
  getUserFriendlyMessage: jest.fn(() => 'Error occurred')
}));

describe('AIAgentScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getItem.mockResolvedValue([]);
    storage.setItem.mockResolvedValue(true);
  });

  it('renders initial greeting message', () => {
    const { getByText } = render(<AIAgentScreen />);
    expect(getByText(/Hi, I'm here to support you/i)).toBeTruthy();
  });

  it('renders Quick Help buttons', () => {
    const { getByText } = render(<AIAgentScreen />);
    expect(getByText('Help me calm down')).toBeTruthy();
    expect(getByText('Breathing exercises')).toBeTruthy();
  });

  it('renders text input and send button', () => {
    const { getByPlaceholderText, getByLabelText } = render(<AIAgentScreen />);
    expect(getByPlaceholderText(/How are you feeling/i)).toBeTruthy();
    expect(getByLabelText('Send message')).toBeTruthy();
  });

  it('sends message and displays AI response', async () => {
    sendMessageToOpenAI.mockResolvedValue('I understand. Let me help you.');
    
    const { getByPlaceholderText, getByLabelText, getByText } = render(<AIAgentScreen />);
    const input = getByPlaceholderText(/How are you feeling/i);
    const sendButton = getByLabelText('Send message');
    
    fireEvent.changeText(input, 'I feel overwhelmed');
    fireEvent.press(sendButton);
    
    await waitFor(() => {
      expect(getByText('I feel overwhelmed')).toBeTruthy();
      expect(getByText('I understand. Let me help you.')).toBeTruthy();
    });
  });

  it('clears input after sending', async () => {
    sendMessageToOpenAI.mockResolvedValue('Response');
    
    const { getByPlaceholderText, getByLabelText } = render(<AIAgentScreen />);
    const input = getByPlaceholderText(/How are you feeling/i);
    const sendButton = getByLabelText('Send message');
    
    fireEvent.changeText(input, 'Test');
    fireEvent.press(sendButton);
    
    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });

  it('shows typing indicator', async () => {
    sendMessageToOpenAI.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve('Response'), 100))
    );
    
    const { getByPlaceholderText, getByLabelText, getByText } = render(<AIAgentScreen />);
    const input = getByPlaceholderText(/How are you feeling/i);
    const sendButton = getByLabelText('Send message');
    
    fireEvent.changeText(input, 'Test');
    fireEvent.press(sendButton);
    
    await waitFor(() => {
      expect(getByText('AI is typing...')).toBeTruthy();
    });
  });

  it('handles API errors gracefully', async () => {
    sendMessageToOpenAI.mockRejectedValue(new Error('API Error'));
    
    const { getByPlaceholderText, getByLabelText, getByText } = render(<AIAgentScreen />);
    const input = getByPlaceholderText(/How are you feeling/i);
    const sendButton = getByLabelText('Send message');
    
    fireEvent.changeText(input, 'Test');
    fireEvent.press(sendButton);
    
    await waitFor(() => {
      expect(getByText('Error occurred')).toBeTruthy();
    });
  });

  it('loads conversation history', async () => {
    const mockHistory = [
      { type: 'user', text: 'Previous message' },
      { type: 'ai', text: 'Previous response' }
    ];
    storage.getItem.mockResolvedValue(mockHistory);
    
    const { getByText } = render(<AIAgentScreen />);
    
    await waitFor(() => {
      expect(getByText('Previous message')).toBeTruthy();
      expect(getByText('Previous response')).toBeTruthy();
    });
  });
});
