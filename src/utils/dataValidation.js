// Data validation utilities

export const validateMoodEntry = (entry) => {
  if (!entry) return false;
  if (typeof entry.mood !== 'number' || entry.mood < 1 || entry.mood > 5) return false;
  if (!entry.moodName || typeof entry.moodName !== 'string') return false;
  if (!entry.date || !entry.timestamp) return false;
  return true;
};

export const validateTechniqueUsage = (usage) => {
  if (!usage) return false;
  if (!usage.technique || typeof usage.technique !== 'string') return false;
  if (!usage.category || typeof usage.category !== 'string') return false;
  if (!usage.date || !usage.timestamp) return false;
  if (usage.effectiveness && (usage.effectiveness < 1 || usage.effectiveness > 5)) return false;
  return true;
};

export const validateSafetyPlan = (plan) => {
  if (!plan || typeof plan !== 'object') return false;
  // Safety plan can have various fields, just check it's an object
  return true;
};

export const sanitizeText = (text, maxLength = 500) => {
  if (!text || typeof text !== 'string') return '';
  return text.trim().substring(0, maxLength);
};

export const validatePreferences = (prefs) => {
  if (!prefs || typeof prefs !== 'object') return false;
  // Check boolean fields
  const booleanFields = ['darkMode', 'notifications', 'moodReminders', 'breathingReminders', 'hapticFeedback', 'dataSharing'];
  for (const field of booleanFields) {
    if (prefs[field] !== undefined && typeof prefs[field] !== 'boolean') {
      return false;
    }
  }
  return true;
};

export const cleanStorageData = async (storage, key, validator) => {
  try {
    const data = await storage.getItem(key);
    if (!data || !Array.isArray(data)) return [];
    
    // Filter out invalid entries
    const validData = data.filter(validator);
    
    // If data was cleaned, save it back
    if (validData.length !== data.length) {
      await storage.setItem(key, validData);
    }
    
    return validData;
  } catch (error) {
    console.error(`Error cleaning ${key}:`, error);
    return [];
  }
};
