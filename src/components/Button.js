import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, designTokens } from '../context/ThemeContext';

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  icon, 
  style,
  textStyle,
  disabled = false,
  ...props 
}) {
  const { theme } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyle = () => {
    if (variant === 'outline') {
      return {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.primary,
      };
    }
    return {};
  };

  const getTextColor = () => {
    if (variant === 'outline') return theme.primary;
    if (variant === 'secondary') return theme.text;
    return '#FFFFFF';
  };

  const buttonContent = (
    <>
      {icon && icon}
      <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
        {title}
      </Text>
    </>
  );

  if (variant === 'primary' && !disabled) {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={onPress}
          disabled={disabled}
          activeOpacity={0.9}
          {...props}
        >
          <LinearGradient
            colors={[theme.primaryGradientTop, theme.primaryGradientBottom]}
            style={[styles.button, designTokens.shadows.button, { shadowColor: theme.shadow }]}
          >
            {buttonContent}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  if (variant === 'primary' && disabled) {
    return (
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.disabledButton,
          ]}
          onPress={onPress}
          disabled={disabled}
          activeOpacity={1}
          {...props}
        >
          {buttonContent}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        style={[
          styles.button,
          getButtonStyle(),
          variant === 'secondary' && { backgroundColor: theme.card },
          disabled && styles.disabled,
          designTokens.shadows.button,
          { shadowColor: theme.shadow },
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        {...props}
      >
        {buttonContent}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: designTokens.borderRadius.button,
    minHeight: 52,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
});
