import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Card from './Card';
import { dailyReminders } from '../data/dailyReminders';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH; // Full screen width
const MIN_CARD_HEIGHT = SCREEN_HEIGHT * 0.2; // 20% of screen height

export default function SwipeableReminders() {
  const { theme } = useTheme();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Create a new shuffled array each time component mounts
  const [reminders] = useState(() => {
    const shuffled = [...dailyReminders].sort(() => 0.5 - Math.random());
    return shuffled;
  });

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  const scrollToPrevious = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
    }
  };

  const renderReminder = ({ item, index }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardInner}>
        <Card variant="strong">
          <View style={styles.quoteIcon}>
            <Ionicons name="chatbox-ellipses" size={24} color={theme.primary} />
          </View>
          <Text style={[styles.reminderText, { color: theme.textSecondary }]}>
            "{item}"
          </Text>
        </Card>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={reminders}
        renderItem={renderReminder}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  cardContainer: {
    width: CARD_WIDTH,
  },
  cardInner: {
    paddingHorizontal: 20,
    minHeight: MIN_CARD_HEIGHT,
    justifyContent: 'center',
  },
  quoteIcon: {
    marginBottom: 12,
  },
  reminderText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
});
