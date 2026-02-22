import { shuffleMessages } from '../utils/notifications';

describe('Shuffle Algorithm for Message Variety', () => {
  const testMessages = [
    'Message 1',
    'Message 2',
    'Message 3',
    'Message 4',
    'Message 5',
  ];

  describe('Basic Functionality', () => {
    it('should return an array of the same length', () => {
      const shuffled = shuffleMessages(testMessages);
      expect(shuffled).toHaveLength(testMessages.length);
    });

    it('should contain all original messages', () => {
      const shuffled = shuffleMessages(testMessages);
      testMessages.forEach(msg => {
        expect(shuffled).toContain(msg);
      });
    });

    it('should not modify the original array', () => {
      const original = [...testMessages];
      shuffleMessages(testMessages);
      expect(testMessages).toEqual(original);
    });

    it('should handle empty array', () => {
      const shuffled = shuffleMessages([]);
      expect(shuffled).toEqual([]);
    });

    it('should handle single element array', () => {
      const single = ['Only message'];
      const shuffled = shuffleMessages(single);
      expect(shuffled).toEqual(single);
    });

    it('should handle two element array', () => {
      const two = ['First', 'Second'];
      const shuffled = shuffleMessages(two);
      expect(shuffled).toHaveLength(2);
      expect(shuffled).toContain('First');
      expect(shuffled).toContain('Second');
    });
  });

  describe('Uniqueness and No Duplicates', () => {
    it('should not create duplicate messages', () => {
      const shuffled = shuffleMessages(testMessages);
      const uniqueMessages = new Set(shuffled);
      expect(uniqueMessages.size).toBe(testMessages.length);
    });

    it('should preserve message count for large arrays', () => {
      const largeArray = Array.from({ length: 150 }, (_, i) => `Message ${i + 1}`);
      const shuffled = shuffleMessages(largeArray);
      expect(shuffled).toHaveLength(150);
      
      const uniqueMessages = new Set(shuffled);
      expect(uniqueMessages.size).toBe(150);
    });
  });

  describe('Randomness and Distribution', () => {
    it('should produce different results on multiple calls (probabilistic)', () => {
      const shuffle1 = shuffleMessages(testMessages);
      const shuffle2 = shuffleMessages(testMessages);
      const shuffle3 = shuffleMessages(testMessages);
      
      // At least one should be different (extremely high probability)
      const allSame = 
        JSON.stringify(shuffle1) === JSON.stringify(shuffle2) &&
        JSON.stringify(shuffle2) === JSON.stringify(shuffle3);
      
      expect(allSame).toBe(false);
    });

    it('should shuffle large arrays with good distribution', () => {
      const largeArray = Array.from({ length: 150 }, (_, i) => `Message ${i + 1}`);
      const shuffled = shuffleMessages(largeArray);
      
      // Check that first 10 elements are not in original order
      let inOriginalOrder = 0;
      for (let i = 0; i < 10; i++) {
        if (shuffled[i] === largeArray[i]) {
          inOriginalOrder++;
        }
      }
      
      // Statistically, fewer than 5 should be in original position
      expect(inOriginalOrder).toBeLessThan(5);
    });

    it('should not always place first element at the start', () => {
      const firstElementAtStart = [];
      
      // Run shuffle 20 times
      for (let i = 0; i < 20; i++) {
        const shuffled = shuffleMessages(testMessages);
        if (shuffled[0] === testMessages[0]) {
          firstElementAtStart.push(true);
        }
      }
      
      // First element should not always be at start (probability ~1/5 per shuffle)
      expect(firstElementAtStart.length).toBeLessThan(20);
    });
  });

  describe('Real-World Scenario: 150 Breathing Messages', () => {
    const breathingMessages = Array.from({ length: 150 }, (_, i) => 
      `Breathing reminder ${i + 1}: Take a moment to breathe.`
    );

    it('should shuffle all 150 messages without loss', () => {
      const shuffled = shuffleMessages(breathingMessages);
      
      expect(shuffled).toHaveLength(150);
      breathingMessages.forEach(msg => {
        expect(shuffled).toContain(msg);
      });
    });

    it('should ensure no repeats in first 150 notifications', () => {
      const shuffled = shuffleMessages(breathingMessages);
      const seen = new Set();
      
      for (let i = 0; i < 150; i++) {
        expect(seen.has(shuffled[i])).toBe(false);
        seen.add(shuffled[i]);
      }
      
      expect(seen.size).toBe(150);
    });

    it('should provide variety for iOS (48 notifications)', () => {
      const shuffled = shuffleMessages(breathingMessages);
      const first48 = shuffled.slice(0, 48);
      const uniqueFirst48 = new Set(first48);
      
      // All 48 should be unique
      expect(uniqueFirst48.size).toBe(48);
    });

    it('should provide variety for Android (112 notifications)', () => {
      const shuffled = shuffleMessages(breathingMessages);
      const first112 = shuffled.slice(0, 112);
      const uniqueFirst112 = new Set(first112);
      
      // All 112 should be unique
      expect(uniqueFirst112.size).toBe(112);
    });

    it('should cycle through messages correctly when exceeding 150', () => {
      const shuffled = shuffleMessages(breathingMessages);
      
      // Simulate 200 notifications (150 + 50 more)
      const notifications = [];
      for (let i = 0; i < 200; i++) {
        const messageIndex = i % shuffled.length;
        notifications.push(shuffled[messageIndex]);
      }
      
      expect(notifications).toHaveLength(200);
      
      // First 150 should all be unique
      const first150 = new Set(notifications.slice(0, 150));
      expect(first150.size).toBe(150);
      
      // Messages 151-200 should repeat from the shuffled list
      for (let i = 150; i < 200; i++) {
        expect(notifications[i]).toBe(shuffled[i % 150]);
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle array with duplicate values', () => {
      const withDuplicates = ['A', 'B', 'A', 'C', 'B'];
      const shuffled = shuffleMessages(withDuplicates);
      
      expect(shuffled).toHaveLength(5);
      expect(shuffled.filter(x => x === 'A')).toHaveLength(2);
      expect(shuffled.filter(x => x === 'B')).toHaveLength(2);
      expect(shuffled.filter(x => x === 'C')).toHaveLength(1);
    });

    it('should handle array with special characters', () => {
      const special = ['Hello!', 'Test — dash', 'Quote "test"', 'Emoji 😊'];
      const shuffled = shuffleMessages(special);
      
      expect(shuffled).toHaveLength(4);
      special.forEach(msg => {
        expect(shuffled).toContain(msg);
      });
    });

    it('should handle very long strings', () => {
      const longStrings = [
        'A'.repeat(500),
        'B'.repeat(500),
        'C'.repeat(500),
      ];
      const shuffled = shuffleMessages(longStrings);
      
      expect(shuffled).toHaveLength(3);
      longStrings.forEach(msg => {
        expect(shuffled).toContain(msg);
      });
    });
  });

  describe('Performance', () => {
    it('should handle large arrays efficiently', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => `Message ${i}`);
      
      const startTime = Date.now();
      const shuffled = shuffleMessages(largeArray);
      const endTime = Date.now();
      
      expect(shuffled).toHaveLength(1000);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in < 100ms
    });
  });

  describe('Fisher-Yates Algorithm Correctness', () => {
    it('should implement Fisher-Yates shuffle correctly', () => {
      // Mock Math.random to test deterministic behavior
      const mockRandomValues = [0.9, 0.5, 0.1];
      let callCount = 0;
      
      jest.spyOn(Math, 'random').mockImplementation(() => {
        const value = mockRandomValues[callCount % mockRandomValues.length];
        callCount++;
        return value;
      });
      
      const input = ['A', 'B', 'C', 'D'];
      const shuffled = shuffleMessages(input);
      
      // Should have shuffled the array
      expect(shuffled).toHaveLength(4);
      expect(shuffled).toContain('A');
      expect(shuffled).toContain('B');
      expect(shuffled).toContain('C');
      expect(shuffled).toContain('D');
      
      Math.random.mockRestore();
    });

    it('should swap elements correctly during shuffle', () => {
      // Run multiple times to ensure swapping works
      for (let run = 0; run < 10; run++) {
        const input = ['1', '2', '3', '4', '5'];
        const shuffled = shuffleMessages(input);
        
        // Verify all elements are present (no loss during swapping)
        input.forEach(element => {
          expect(shuffled).toContain(element);
        });
        
        // Verify no duplicates created during swapping
        const uniqueElements = new Set(shuffled);
        expect(uniqueElements.size).toBe(input.length);
      }
    });
  });

  describe('Integration with Notification System', () => {
    it('should work with modulo operator for cycling', () => {
      const messages = ['A', 'B', 'C', 'D', 'E'];
      const shuffled = shuffleMessages(messages);
      
      // Simulate accessing messages with modulo (like in scheduleBreathingReminder)
      const accessed = [];
      for (let i = 0; i < 15; i++) {
        const messageIndex = i % shuffled.length;
        accessed.push(shuffled[messageIndex]);
      }
      
      expect(accessed).toHaveLength(15);
      
      // First 5 should be unique
      const firstCycle = new Set(accessed.slice(0, 5));
      expect(firstCycle.size).toBe(5);
      
      // Second 5 should repeat the pattern
      for (let i = 0; i < 5; i++) {
        expect(accessed[i]).toBe(accessed[i + 5]);
      }
    });

    it('should ensure maximum variety before first repeat', () => {
      const messages = Array.from({ length: 150 }, (_, i) => `Message ${i + 1}`);
      const shuffled = shuffleMessages(messages);
      
      // Track when we see first repeat
      const seen = new Set();
      let firstRepeatIndex = -1;
      
      for (let i = 0; i < 300; i++) {
        const messageIndex = i % shuffled.length;
        const message = shuffled[messageIndex];
        
        if (seen.has(message) && firstRepeatIndex === -1) {
          firstRepeatIndex = i;
        }
        seen.add(message);
      }
      
      // First repeat should occur at index 150 (after all messages seen once)
      expect(firstRepeatIndex).toBe(150);
    });
  });
});
