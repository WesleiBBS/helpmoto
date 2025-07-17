import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, DIMENSIONS } from '../constants';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    if (error) {
      baseStyle.push(styles.errorContainer);
    } else if (isFocused) {
      baseStyle.push(styles.focusedContainer);
    }
    
    if (!editable) {
      baseStyle.push(styles.disabledContainer);
    }
    
    return baseStyle;
  };

  return (
    <View style={[styles.wrapper, style]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={getContainerStyle()}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Ionicons 
              name={leftIcon} 
              size={DIMENSIONS.iconSize.md} 
              color={error ? COLORS.error : isFocused ? COLORS.primary : COLORS.gray[500]} 
            />
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            multiline && styles.multilineInput,
            inputStyle
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray[500]}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        
        {(rightIcon || secureTextEntry) && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={secureTextEntry ? togglePasswordVisibility : onRightIconPress}
            disabled={!secureTextEntry && !onRightIconPress}
          >
            <Ionicons
              name={
                secureTextEntry
                  ? isPasswordVisible
                    ? 'eye-off-outline'
                    : 'eye-outline'
                  : rightIcon
              }
              size={DIMENSIONS.iconSize.md}
              color={error ? COLORS.error : isFocused ? COLORS.primary : COLORS.gray[500]}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text style={[styles.errorText, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: DIMENSIONS.spacing.md,
  },
  label: {
    fontSize: DIMENSIONS.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: DIMENSIONS.borderRadius.md,
    backgroundColor: COLORS.surface,
    minHeight: 48,
  },
  focusedContainer: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  errorContainer: {
    borderColor: COLORS.error,
  },
  disabledContainer: {
    backgroundColor: COLORS.gray[100],
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: DIMENSIONS.fontSize.md,
    color: COLORS.text,
    paddingHorizontal: DIMENSIONS.spacing.md,
    paddingVertical: DIMENSIONS.spacing.sm,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  leftIconContainer: {
    paddingLeft: DIMENSIONS.spacing.md,
    paddingRight: DIMENSIONS.spacing.xs,
  },
  rightIconContainer: {
    paddingRight: DIMENSIONS.spacing.md,
    paddingLeft: DIMENSIONS.spacing.xs,
  },
  errorText: {
    fontSize: DIMENSIONS.fontSize.xs,
    color: COLORS.error,
    marginTop: DIMENSIONS.spacing.xs,
  },
});

export default Input;

