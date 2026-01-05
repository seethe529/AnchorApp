import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

export default function WheelPicker({ items, selectedValue, onValueChange, style }) {
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const index = items.findIndex(item => item.value === selectedValue);
    if (index !== -1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, []);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const item = items[index];
    if (item && item.value !== selectedValue) {
      onValueChange(item.value);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.highlight} />
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={{
          paddingVertical: ITEM_HEIGHT * 2,
        }}
      >
        {items.map((item, index) => (
          <View key={index} style={styles.item}>
            <Text style={styles.itemText}>{item.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
  },
  highlight: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2E845D',
    backgroundColor: 'rgba(46, 132, 93, 0.1)',
    zIndex: 1,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
    color: '#333',
  },
});
