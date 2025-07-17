import React from 'react';
import { Ionicons } from './Icons';
import { COLORS, DIMENSIONS } from '../constants';

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  onChange, // Para compatibilidade web
  leftIcon,
  rightIcon,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
  inputStyle,
  type = 'text',
  ...props
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value;
    if (onChangeText) onChangeText(newValue);
    if (onChange) onChange(e);
  };

  const containerStyle = {
    marginBottom: DIMENSIONS.spacing.md,
    ...style,
  };

  const labelStyle = {
    fontSize: DIMENSIONS.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: DIMENSIONS.spacing.xs,
    display: 'block',
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const baseInputStyle = {
    width: '100%',
    padding: DIMENSIONS.spacing.md,
    fontSize: DIMENSIONS.fontSize.md,
    border: `1px solid ${COLORS.border}`,
    borderRadius: DIMENSIONS.borderRadius.md,
    backgroundColor: editable ? COLORS.surface : COLORS.gray[100],
    color: COLORS.text,
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    paddingLeft: leftIcon ? '48px' : DIMENSIONS.spacing.md,
    paddingRight: rightIcon ? '48px' : DIMENSIONS.spacing.md,
    minHeight: multiline ? `${numberOfLines * 24 + 32}px` : '44px',
    resize: multiline ? 'vertical' : 'none',
    ...inputStyle,
  };

  const focusStyle = `
    input:focus, textarea:focus {
      border-color: ${COLORS.primary};
      box-shadow: 0 0 0 3px ${COLORS.primary}20;
    }
  `;

  const iconStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    color: COLORS.textSecondary,
    pointerEvents: 'none',
    zIndex: 1,
  };

  const leftIconStyle = {
    ...iconStyle,
    left: DIMENSIONS.spacing.md,
  };

  const rightIconStyle = {
    ...iconStyle,
    right: DIMENSIONS.spacing.md,
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div style={containerStyle}>
      <style>{focusStyle}</style>
      {label && <label style={labelStyle}>{label}</label>}
      <div style={inputWrapperStyle}>
        {leftIcon && (
          <div style={leftIconStyle}>
            <Ionicons name={leftIcon} size={20} color={COLORS.textSecondary} />
          </div>
        )}
        
        <InputComponent
          type={multiline ? undefined : type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={!editable}
          style={baseInputStyle}
          rows={multiline ? numberOfLines : undefined}
          {...props}
        />
        
        {rightIcon && (
          <div style={rightIconStyle}>
            <Ionicons name={rightIcon} size={20} color={COLORS.textSecondary} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
