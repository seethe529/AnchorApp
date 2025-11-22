import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, designTokens } from '../context/ThemeContext';

export default function Card({ children, style, variant = 'default', ...props }) {
  const { theme } = useTheme();

  const shadowStyle = variant === 'strong' 
    ? designTokens.shadows.cardStrong 
    : designTokens.shadows.card;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          shadowColor: theme.shadow,
        },
        shadowStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: designTokens.borderRadius.card,
    padding: designTokens.spacing.cardPadding,
    marginBottom: designTokens.spacing.cardMargin,
  },
});
