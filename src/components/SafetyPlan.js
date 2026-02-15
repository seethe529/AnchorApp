import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking, Modal, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { secureStorage, STORAGE_KEYS } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

export default function SafetyPlan() {
  const { theme } = useTheme();
  const isFocused = useIsFocused();
  const [plan, setPlan] = useState({
    warningSigns: [],
    copingStrategies: [],
    socialContacts: [],
    professionalContacts: [],
    environmentSafety: [],
    reasonsToLive: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('item');
  const [modalSection, setModalSection] = useState(null);
  const [modalValue, setModalValue] = useState('');
  const [tempContactName, setTempContactName] = useState('');

  useEffect(() => {
    if (isFocused) {
      loadSafetyPlan();
    }
  }, [isFocused]);

  const loadSafetyPlan = async () => {
    try {
      const savedPlan = await secureStorage.getItem(STORAGE_KEYS.SAFETY_PLAN);
      if (savedPlan) {
        const migratedPlan = {
          warningSigns: migrateToArray(savedPlan.warningSigns, 'warningSigns'),
          copingStrategies: migrateToArray(savedPlan.copingStrategies, 'copingStrategies'),
          socialContacts: migrateToArray(savedPlan.socialContacts, 'socialContacts'),
          professionalContacts: migrateToArray(savedPlan.professionalContacts, 'professionalContacts'),
          environmentSafety: migrateToArray(savedPlan.environmentSafety, 'environmentSafety'),
          reasonsToLive: migrateToArray(savedPlan.reasonsToLive, 'reasonsToLive')
        };
        setPlan(migratedPlan);
        
        if (needsMigration(savedPlan)) {
          await secureStorage.setItem(STORAGE_KEYS.SAFETY_PLAN, migratedPlan);
        }
      }
    } catch (error) {
      console.error('Error loading safety plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const migrateToArray = (data, sectionKey) => {
    if (Array.isArray(data)) {
      return data;
    }
    
    if (typeof data === 'string' && data.trim()) {
      const lines = data.split('\n').filter(line => line.trim());
      
      if (sectionKey === 'socialContacts' || sectionKey === 'professionalContacts') {
        return lines.map((line, index) => {
          const match = line.match(/^(.+?)\s*[-:]\s*(.+)$/);
          if (match) {
            return {
              id: `migrated-${Date.now()}-${index}`,
              name: match[1].trim(),
              phone: match[2].trim()
            };
          }
          return {
            id: `migrated-${Date.now()}-${index}`,
            text: line.trim()
          };
        });
      }
      
      return lines.map((line, index) => ({
        id: `migrated-${Date.now()}-${index}`,
        text: line.trim()
      }));
    }
    
    return [];
  };

  const needsMigration = (plan) => {
    return Object.values(plan).some(value => typeof value === 'string');
  };

  const saveSafetyPlan = async () => {
    try {
      await secureStorage.setItem(STORAGE_KEYS.SAFETY_PLAN, plan);
      setIsEditing(false);
      Alert.alert('Success', 'Safety plan saved successfully');
    } catch (error) {
      console.error('Error saving safety plan:', error);
      Alert.alert('Error', 'Failed to save safety plan');
    }
  };

  const formatPhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length === 10) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    if (digits.length === 11) {
      return `${digits.slice(0, 1)}-${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return phone;
  };

  const addItem = (section) => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Add Item',
        `Add a new item to ${sections.find(s => s.key === section)?.title}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Add',
            onPress: (text) => {
              if (text && text.trim()) {
                setPlan(prev => ({
                  ...prev,
                  [section]: [...prev[section], { id: Date.now().toString(), text: text.trim() }]
                }));
              }
            }
          }
        ],
        'plain-text'
      );
    } else {
      setModalType('item');
      setModalSection(section);
      setModalValue('');
      setModalVisible(true);
    }
  };

  const addContact = (section) => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        'Add Contact',
        'Enter name',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Next',
            onPress: (name) => {
              if (name && name.trim()) {
                Alert.prompt(
                  'Add Phone Number',
                  'Enter phone number',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Add',
                      onPress: (phone) => {
                        if (phone && phone.trim()) {
                          setPlan(prev => ({
                            ...prev,
                            [section]: [...prev[section], { 
                              id: Date.now().toString(), 
                              name: name.trim(), 
                              phone: formatPhoneNumber(phone.trim())
                            }]
                          }));
                        }
                      }
                    }
                  ],
                  'plain-text'
                );
              }
            }
          }
        ],
        'plain-text'
      );
    } else {
      setModalType('contact-name');
      setModalSection(section);
      setModalValue('');
      setTempContactName('');
      setModalVisible(true);
    }
  };

  const handleModalSubmit = () => {
    if (modalType === 'item') {
      if (modalValue.trim()) {
        setPlan(prev => ({
          ...prev,
          [modalSection]: [...prev[modalSection], { id: Date.now().toString(), text: modalValue.trim() }]
        }));
        setModalVisible(false);
        setModalValue('');
      }
    } else if (modalType === 'contact-name') {
      if (modalValue.trim()) {
        setTempContactName(modalValue.trim());
        setModalType('contact-phone');
        setModalValue('');
      }
    } else if (modalType === 'contact-phone') {
      if (modalValue.trim()) {
        setPlan(prev => ({
          ...prev,
          [modalSection]: [...prev[modalSection], { 
            id: Date.now().toString(), 
            name: tempContactName, 
            phone: formatPhoneNumber(modalValue.trim())
          }]
        }));
        setModalVisible(false);
        setModalValue('');
        setTempContactName('');
      }
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setModalValue('');
    setTempContactName('');
    setModalType('item');
  };

  const removeItem = (section, id) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPlan(prev => ({
              ...prev,
              [section]: prev[section].filter(item => item.id !== id)
            }));
          }
        }
      ]
    );
  };

  const callContact = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const textContact = (phone) => {
    Linking.openURL(`sms:${phone}`);
  };

  const sections = [
    { key: 'warningSigns', title: 'Warning Signs', icon: 'warning', type: 'list' },
    { key: 'copingStrategies', title: 'Coping Strategies', icon: 'fitness', type: 'list' },
    { key: 'socialContacts', title: 'Social Support', icon: 'people', type: 'contact' },
    { key: 'professionalContacts', title: 'Professional Contacts', icon: 'medical', type: 'contact' },
    { key: 'environmentSafety', title: 'Environment Safety', icon: 'shield', type: 'list' },
    { key: 'reasonsToLive', title: 'Reasons for Living', icon: 'heart', type: 'list' }
  ];

  const getModalTitle = () => {
    if (modalType === 'item') return 'Add Item';
    if (modalType === 'contact-name') return 'Add Contact';
    return 'Add Phone Number';
  };

  const getModalPlaceholder = () => {
    if (modalType === 'item') return 'Enter item';
    if (modalType === 'contact-name') return 'Enter name';
    return 'Enter phone number';
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Loading safety plan...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.background }]}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <Text style={[styles.title, { color: theme.primary }]}>Personal Safety Plan</Text>
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.primary }]}
            onPress={() => isEditing ? saveSafetyPlan() : setIsEditing(true)}
            accessibilityLabel={isEditing ? 'Save safety plan' : 'Edit safety plan'}
            accessibilityHint={isEditing ? 'Saves your changes to the safety plan' : 'Allows you to edit your safety plan'}
            accessibilityRole="button"
          >
            <Ionicons name={isEditing ? 'checkmark' : 'create'} size={24} color="white" />
          </TouchableOpacity>
        </View>

        {sections.map((section) => (
          <View key={section.key} style={[styles.section, { backgroundColor: theme.card }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon} size={24} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
            </View>
            
            {plan[section.key].length === 0 ? (
              <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
                {isEditing ? 'Tap + to add items' : 'No items added yet'}
              </Text>
            ) : (
              plan[section.key].map((item) => (
                <View key={item.id} style={styles.listItem}>
                  {section.type === 'contact' ? (
                    <>
                      <View style={styles.contactInfo}>
                        <Text style={[styles.contactName, { color: theme.text }]}>{item.name}</Text>
                        <Text style={[styles.contactPhone, { color: theme.textSecondary }]}>{item.phone}</Text>
                      </View>
                      <View style={styles.contactActions}>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.primary }]}
                          onPress={() => callContact(item.phone)}
                          accessibilityLabel={`Call ${item.name}`}
                          accessibilityRole="button"
                        >
                          <Ionicons name="call" size={18} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: theme.primary }]}
                          onPress={() => textContact(item.phone)}
                          accessibilityLabel={`Text ${item.name}`}
                          accessibilityRole="button"
                        >
                          <Ionicons name="chatbubble" size={18} color="white" />
                        </TouchableOpacity>
                        {isEditing && (
                          <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: '#e74c3c' }]}
                            onPress={() => removeItem(section.key, item.id)}
                            accessibilityLabel={`Remove ${item.name}`}
                            accessibilityRole="button"
                          >
                            <Ionicons name="trash" size={18} color="white" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={[styles.listItemText, { color: theme.text }]}>{item.text}</Text>
                      {isEditing && (
                        <TouchableOpacity
                          style={[styles.removeButton, { backgroundColor: '#e74c3c' }]}
                          onPress={() => removeItem(section.key, item.id)}
                          accessibilityLabel="Remove item"
                          accessibilityRole="button"
                        >
                          <Ionicons name="close" size={18} color="white" />
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>
              ))
            )}

            {isEditing && (
              <TouchableOpacity
                style={[styles.addButton, { borderColor: theme.primary }]}
                onPress={() => section.type === 'contact' ? addContact(section.key) : addItem(section.key)}
                accessibilityLabel={`Add ${section.type === 'contact' ? 'contact' : 'item'}`}
                accessibilityRole="button"
              >
                <Ionicons name="add" size={24} color={theme.primary} />
                <Text style={[styles.addButtonText, { color: theme.primary }]}>
                  Add {section.type === 'contact' ? 'Contact' : 'Item'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={[styles.emergencySection, { backgroundColor: 'rgba(46, 139, 87, 0.15)' }]}>
          <Text style={[styles.emergencyTitle, { color: theme.primary }]}>Emergency Contacts</Text>
          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: theme.primary }]}
            onPress={() => Linking.openURL('tel:988')}
            accessibilityLabel="National Suicide Prevention Lifeline, 988"
            accessibilityHint="Call for immediate crisis support"
            accessibilityRole="button"
          >
            <Text style={styles.emergencyText}>National Suicide Prevention Lifeline: 988</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: theme.primary }]}
            onPress={() => Linking.openURL('sms:741741&body=HOME')}
            accessibilityLabel="Crisis Text Line, Text HOME to 741741"
            accessibilityHint="Send a text message for crisis support"
            accessibilityRole="button"
          >
            <Text style={styles.emergencyText}>Crisis Text Line: Text HOME to 741741</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: theme.primary }]}
            onPress={() => Linking.openURL('tel:18002738255')}
            accessibilityLabel="Veterans Crisis Line, 1-800-273-8255"
            accessibilityHint="Call for veteran-specific crisis support"
            accessibilityRole="button"
          >
            <Text style={styles.emergencyText}>Veterans Crisis Line: 1-800-273-8255</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalCancel}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{getModalTitle()}</Text>
            <TextInput
              style={[styles.modalInput, { 
                backgroundColor: theme.background, 
                color: theme.text,
                borderColor: theme.primary 
              }]}
              placeholder={getModalPlaceholder()}
              placeholderTextColor={theme.textTertiary}
              value={modalValue}
              onChangeText={setModalValue}
              autoFocus={true}
              keyboardType={modalType === 'contact-phone' ? 'phone-pad' : 'default'}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.textSecondary }]}
                onPress={handleModalCancel}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.primary }]}
                onPress={handleModalSubmit}
              >
                <Text style={styles.modalButtonText}>
                  {modalType === 'contact-name' ? 'Next' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  editButton: { padding: 10, borderRadius: 20 },
  section: { margin: 10, padding: 15, borderRadius: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  emptyText: { fontSize: 14, fontStyle: 'italic', padding: 12 },
  listItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.1)'
  },
  listItemText: { flex: 1, fontSize: 16 },
  removeButton: { 
    padding: 6, 
    borderRadius: 16, 
    marginLeft: 8 
  },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: '600' },
  contactPhone: { fontSize: 14, marginTop: 2 },
  contactActions: { flexDirection: 'row', gap: 8 },
  actionButton: { 
    padding: 8, 
    borderRadius: 20, 
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    padding: 12, 
    borderRadius: 8, 
    borderWidth: 2, 
    borderStyle: 'dashed',
    marginTop: 8
  },
  addButtonText: { fontSize: 16, fontWeight: '600', marginLeft: 8 },
  emergencySection: { margin: 10, padding: 15, borderRadius: 10 },
  emergencyTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  emergencyButton: { padding: 12, borderRadius: 8, marginBottom: 8 },
  emergencyText: { color: 'white', fontSize: 16, textAlign: 'center' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '85%',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center'
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});
