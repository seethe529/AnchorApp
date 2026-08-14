import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { suggestTechniques } from '../data/techniques';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { sendMessageToOpenAI } from '../services/openai';
import ErrorLogger from '../utils/errorLogger';
import { useTheme, designTokens } from '../context/ThemeContext';
import Card from '../components/Card';

export default function AIAgentScreen({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    { type: 'ai', text: 'Hey! I\'m Anchor, your personal support companion. I\'m here to help you navigate difficult moments with evidence-based techniques and compassionate guidance. You\'re not alone in this. How are you feeling right now?' }
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    loadConversationHistory();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when conversation updates
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversation]);

  const loadConversationHistory = async () => {
    try {
      const history = await storage.getItem('conversation_history') || [];
      if (history.length > 0) {
        setConversation(prev => [...prev, ...history.slice(-10)]);
      }
    } catch (error) {
      ErrorLogger.logStorageError(error, 'loadConversationHistory');
    }
  };

  const saveMessage = async (msg) => {
    try {
      const history = await storage.getItem('conversation_history') || [];
      const updatedHistory = [...history, { ...msg, timestamp: new Date().toISOString() }].slice(-50);
      await storage.setItem('conversation_history', updatedHistory);
      
      // Increment lifetime message counter (only for user messages)
      if (msg.type === 'user') {
        const count = await storage.getItem(STORAGE_KEYS.AI_MESSAGE_COUNT) || 0;
        await storage.setItem(STORAGE_KEYS.AI_MESSAGE_COUNT, count + 1);
      }
    } catch (error) {
      ErrorLogger.logStorageError(error, 'saveMessage');
    }
  };

  const handleInputChange = useCallback((text) => {
    setMessage(text);
    if (text.length > 10) {
      const newSuggestions = suggestTechniques(text);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const messageText = message.trim();
    const userMessage = { type: 'user', text: messageText };
    
    // Clear input immediately
    setMessage('');
    setSuggestions([]);
    
    // Add user message
    setConversation(prev => [...prev, userMessage]);
    await saveMessage(userMessage);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Generate AI response using OpenAI
    try {
      const aiResponse = await sendMessageToOpenAI(messageText, conversation);
      const aiMessage = { type: 'ai', text: aiResponse };
      
      setConversation(prev => [...prev, aiMessage]);
      await saveMessage(aiMessage);
    } catch (error) {
      ErrorLogger.log(error, 'sendMessage - AI response');
      const errorMessage = ErrorLogger.getUserFriendlyMessage(error);
      const fallbackMessage = { type: 'ai', text: errorMessage };
      setConversation(prev => [...prev, fallbackMessage]);
      await saveMessage(fallbackMessage);
    } finally {
      setIsTyping(false);
    }
  };



  const renderFormattedText = (text) => {
    return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <Text key={index} style={styles.boldText}>{part.slice(2, -2)}</Text>;
      }
      return part;
    });
  };

  const formatCategory = (category) => {
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const applySuggestion = useCallback((technique) => {
    Alert.alert(
      technique.name,
      technique.description,
      [
        { text: 'Try This', onPress: () => console.log('Navigate to technique') },
        { text: 'Not Now', style: 'cancel' }
      ]
    );
  }, []);

  const quickActions = useMemo(() => [
    { text: "Help me calm down", icon: "heart" },
    { text: "I need grounding techniques", icon: "leaf" },
    { text: "Help with sleep", icon: "moon" },
    { text: "Breathing exercises", icon: "fitness" },
    { text: "Feeling overwhelmed", icon: "cloud" },
    { text: "Need coping strategies", icon: "shield" }
  ], []);

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={{ flex: 1 }} accessible={false}>
      <View style={[styles.quickActionsContainer, { backgroundColor: theme.card, borderBottomColor: theme.border }]} accessibilityRole="menu">
        <Text style={[styles.quickActionsTitle, { color: theme.text }]} accessibilityRole="header">Quick Help:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.quickActionsScroll}
          accessible={false}
        >
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickActionButton, { backgroundColor: theme.primary + '20' }]}
              onPress={async () => {
                setMessage(action.text);
                setTimeout(() => sendMessage(), 0);
              }}
              accessibilityLabel={action.text}
              accessibilityHint="Sends this message to AI support"
              accessibilityRole="button"
            >
              <Ionicons name={action.icon} size={16} color={theme.primary} />
              <Text style={[styles.quickActionText, { color: theme.primary }]}>{action.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={[styles.conversation, { marginBottom: 64 + insets.bottom + 80 }]}
        contentContainerStyle={[
          styles.conversationContent,
          { paddingBottom: 60, paddingTop: 24, paddingHorizontal: 20 }
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        accessible={false}
        accessibilityRole="list"
        accessibilityLabel="Conversation history"
      >
        {conversation.map((msg, index) => (
          <View 
            key={index} 
            style={[styles.message, msg.type === 'user' ? [styles.userMessage, { backgroundColor: theme.primary }] : [styles.aiMessage, { backgroundColor: theme.card }]]}
            accessible={true}
            accessibilityLabel={`${msg.type === 'user' ? 'You said' : 'AI responded'}: ${msg.text}`}
            accessibilityRole="text"
          >
            <Text style={[styles.messageText, msg.type === 'user' ? styles.userText : { color: theme.text }]}>
              {renderFormattedText(msg.text)}
            </Text>
          </View>
        ))}
        
        {isTyping && (
          <View 
            style={[styles.message, styles.aiMessage, { backgroundColor: theme.card }]}
            accessible={true}
            accessibilityLabel="AI is typing"
            accessibilityRole="text"
          >
            <Text style={[styles.typingText, { color: theme.textTertiary }]}>AI is typing...</Text>
          </View>
        )}
      </ScrollView>

      {suggestions.length > 0 && (
        <View style={[
          styles.suggestions,
          {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 64 + insets.bottom + 80,
            maxHeight: 200,
            backgroundColor: theme.card,
            borderTopColor: theme.border
          }
        ]}>
          <ScrollView showsVerticalScrollIndicator={false} accessible={false}>
            <Text 
              style={[styles.suggestionsTitle, { color: theme.text }]}
              accessibilityRole="header"
            >
              Suggested techniques:
            </Text>
            {suggestions.map((suggestion, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.suggestionCard, { backgroundColor: theme.primary + '20' }]} 
                onPress={() => applySuggestion(suggestion)}
                accessibilityLabel={`${suggestion.name}, ${formatCategory(suggestion.category)} technique`}
                accessibilityHint="View details about this technique"
                accessibilityRole="button"
              >
                <Text style={[styles.suggestionName, { color: theme.text }]} accessible={false}>{suggestion.name}</Text>
                <Text style={[styles.suggestionCategory, { color: theme.textSecondary }]} accessible={false}>{formatCategory(suggestion.category)}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 64 + insets.bottom,
          flexDirection: 'row',
          padding: 16,
          alignItems: 'flex-end',
          borderTopWidth: 1,
          borderTopColor: theme.border,
          backgroundColor: theme.card,
        }
      ]} accessible={false}>
        <TextInput
          style={[styles.textInput, { borderColor: theme.border, backgroundColor: theme.background, color: theme.text }]}
          value={message}
          onChangeText={handleInputChange}
          placeholder="How are you feeling? Describe what's happening..."
          placeholderTextColor={theme.textTertiary}
          multiline
          maxLength={500}
          returnKeyType="done"
          blurOnSubmit={true}
          accessible={true}
          accessibilityLabel="Message input field"
          accessibilityHint="Type your message to AI support. Double tap to activate."
          accessibilityRole="none"
        />
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: theme.primary }, !message.trim() && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={!message.trim()}
          accessible={true}
          accessibilityLabel="Send message"
          accessibilityHint="Sends your message to AI support"
          accessibilityRole="button"
          accessibilityState={{ disabled: !message.trim() }}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  conversation: { flex: 1 },
  conversationContent: { paddingBottom: 20, paddingHorizontal: 20, paddingTop: 24 },
  quickActionsContainer: { 
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  quickActionsTitle: { 
    ...designTokens.typography.h2,
    marginBottom: 12,
  },
  quickActionsScroll: { flexDirection: 'row' },
  quickActionButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  quickActionText: { 
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  message: { marginVertical: 6, padding: 16, borderRadius: 16, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#2E845D' },
  aiMessage: { alignSelf: 'flex-start', ...designTokens.shadows.card },
  messageText: { fontSize: 16, lineHeight: 22 },
  boldText: { fontWeight: '700' },
  userText: { color: 'white' },
  aiText: {},
  typingText: { fontStyle: 'italic' },
  suggestions: { 
    padding: 16,
    borderTopWidth: 1,
  },
  suggestionsTitle: { 
    ...designTokens.typography.h2,
    marginBottom: 12,
  },
  suggestionCard: { 
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  suggestionName: { 
    fontSize: 15,
    fontWeight: '600',
  },
  suggestionCategory: { 
    fontSize: 13,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0, // This will be overridden by inline style with insets.bottom + 50
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: 'white',
  },
  textInput: { 
    flex: 1,
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: { 
    padding: 14,
    borderRadius: 24,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: { backgroundColor: '#ccc' }
});