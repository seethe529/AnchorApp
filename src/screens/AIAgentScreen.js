import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { suggestTechniques } from '../data/techniques';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { sendMessageToOpenAI } from '../services/openai';
import ErrorLogger from '../utils/errorLogger';

let Location;
if (Platform.OS !== 'web') {
  Location = require('expo-location');
}

export default function AIAgentScreen({ navigation }) {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([
    { type: 'ai', text: 'Hi, I\'m here to support you through difficult moments. How are you feeling right now?' }
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    loadConversationHistory();
    getCurrentLocation();
  }, []);

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
    } catch (error) {
      ErrorLogger.logStorageError(error, 'saveMessage');
    }
  };

  const getCurrentLocation = async () => {
    if (Platform.OS === 'web') {
      console.log('Location services not available on web');
      return;
    }
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    } catch (error) {
      ErrorLogger.log(error, 'getCurrentLocation');
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
    requestAnimationFrame(async () => {
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
      }
      
      setIsTyping(false);
    });
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
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
      <View 
        style={styles.screenHeader}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="AI Support. Use quick help buttons or type your own message below."
      >
        <Text style={styles.screenHeaderText}>AI Support</Text>
      </View>
      <View 
        style={styles.quickActionsContainer}
        accessible={false}
        accessibilityElementsHidden={false}
      >
        <Text style={styles.quickActionsTitle}>Quick Help:</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.quickActionsScroll}
          accessible={false}
        >
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionButton}
              onPress={() => {
                setMessage(action.text);
                requestAnimationFrame(() => {
                  sendMessage();
                });
              }}
              accessibilityLabel={action.text}
              accessibilityHint="Sends this message to AI support"
              accessibilityRole="button"
            >
              <Ionicons name={action.icon} size={16} color="#2E8B57" />
              <Text style={styles.quickActionText}>{action.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.conversation}
        contentContainerStyle={styles.conversationContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        accessible={false}
      >
        {conversation.map((msg, index) => (
          <View 
            key={index} 
            style={[styles.message, msg.type === 'user' ? styles.userMessage : styles.aiMessage]}
            accessible={true}
            accessibilityLabel={`${msg.type === 'user' ? 'You said' : 'AI responded'}: ${msg.text}`}
            accessibilityRole="text"
          >
            <Text style={[styles.messageText, msg.type === 'user' ? styles.userText : styles.aiText]}>
              {msg.text}
            </Text>
          </View>
        ))}
        
        {isTyping && (
          <View 
            style={[styles.message, styles.aiMessage]}
            accessible={true}
            accessibilityLabel="AI is typing"
            accessibilityRole="text"
          >
            <Text style={styles.typingText}>AI is typing...</Text>
          </View>
        )}
      </ScrollView>

      {suggestions.length > 0 && (
        <View style={styles.suggestions}>
          <Text style={styles.suggestionsTitle}>Suggested techniques:</Text>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity key={index} style={styles.suggestionCard} onPress={() => applySuggestion(suggestion)}>
              <Text style={styles.suggestionName}>{suggestion.name}</Text>
              <Text style={styles.suggestionCategory}>{suggestion.category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.inputContainer} importantForAccessibility="yes">
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={handleInputChange}
          placeholder="How are you feeling? Describe what's happening..."
          multiline
          maxLength={500}
          returnKeyType="done"
          blurOnSubmit={true}
          accessibilityLabel="Message to AI"
          accessibilityHint="Type your message here. Double tap to edit."
          accessibilityRole="search"
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={!message.trim()}
          accessibilityLabel="Send message"
          accessibilityHint="Sends your message to AI support"
          accessibilityRole="button"
          accessibilityState={{ disabled: !message.trim() }}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
      </View>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  screenHeader: { padding: 15, backgroundColor: '#2E8B57', alignItems: 'center' },
  screenHeaderText: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  conversation: { flex: 1 },
  conversationContent: { padding: 15, paddingBottom: 30 },
  quickActionsContainer: { padding: 15, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  quickActionsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  quickActionsScroll: { flexDirection: 'row' },
  quickActionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F8F0', padding: 12, borderRadius: 8, marginRight: 10 },
  quickActionText: { fontSize: 14, color: '#2E8B57', marginLeft: 10, flex: 1 },
  message: { marginVertical: 5, padding: 12, borderRadius: 15, maxWidth: '80%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#2E8B57' },
  aiMessage: { alignSelf: 'flex-start', backgroundColor: 'white', elevation: 1 },
  messageText: { fontSize: 16, lineHeight: 22 },
  userText: { color: 'white' },
  aiText: { color: '#333' },
  typingText: { fontStyle: 'italic', color: '#999' },
  suggestions: { backgroundColor: 'white', padding: 15, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  suggestionsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  suggestionCard: { backgroundColor: '#F0F8F0', padding: 10, borderRadius: 8, marginBottom: 8 },
  suggestionName: { fontSize: 14, fontWeight: '500' },
  suggestionCategory: { fontSize: 12, color: '#666', textTransform: 'capitalize' },
  inputContainer: { flexDirection: 'row', padding: 15, backgroundColor: 'white', alignItems: 'flex-end', borderTopWidth: 1, borderTopColor: '#eee' },
  textInput: { flex: 1, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, maxHeight: 100, fontSize: 16 },
  sendButton: { backgroundColor: '#2E8B57', padding: 12, borderRadius: 20 },
  sendButtonDisabled: { backgroundColor: '#ccc' }
});