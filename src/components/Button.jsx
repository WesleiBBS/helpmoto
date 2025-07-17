import React from 'react';
import { COLORS, DIMENSIONS } from '../constants';

const Button = ({
  title,
  onClick,
  onPress, // Para compatibilidade com React Native
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  children,
  ...props
}) => {
  const handleClick = onClick || onPress;

  const getButtonStyle = () => {
    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: DIMENSIONS.borderRadius.md,
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      textDecoration: 'none',
      fontFamily: 'inherit',
      opacity: disabled ? 0.6 : 1,
    };
    
    // Variantes
    switch (variant) {
      case 'primary':
        Object.assign(baseStyle, {
          backgroundColor: COLORS.primary,
          color: COLORS.white,
        });
        break;
      case 'secondary':
        Object.assign(baseStyle, {
          backgroundColor: COLORS.secondary,
          color: COLORS.white,
        });
        break;
      case 'outline':
        Object.assign(baseStyle, {
          backgroundColor: 'transparent',
          color: COLORS.primary,
          border: `2px solid ${COLORS.primary}`,
        });
        break;
      case 'ghost':
        Object.assign(baseStyle, {
          backgroundColor: 'transparent',
          color: COLORS.primary,
        });
        break;
      case 'danger':
        Object.assign(baseStyle, {
          backgroundColor: COLORS.error,
          color: COLORS.white,
        });
        break;
    }
    
    // Tamanhos
    switch (size) {
      case 'small':
        Object.assign(baseStyle, {
          padding: `${DIMENSIONS.spacing.sm}px ${DIMENSIONS.spacing.md}px`,
          fontSize: DIMENSIONS.fontSize.sm,
          minHeight: '32px',
        });
        break;
      case 'medium':
        Object.assign(baseStyle, {
          padding: `${DIMENSIONS.spacing.md}px ${DIMENSIONS.spacing.lg}px`,
          fontSize: DIMENSIONS.fontSize.md,
          minHeight: '44px',
        });
        break;
      case 'large':
        Object.assign(baseStyle, {
          padding: `${DIMENSIONS.spacing.lg}px ${DIMENSIONS.spacing.xl}px`,
          fontSize: DIMENSIONS.fontSize.lg,
          minHeight: '52px',
        });
        break;
    }
    
    return baseStyle;
  };

  const buttonStyle = {
    ...getButtonStyle(),
    ...style,
  };

  return (
    <button
      style={buttonStyle}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }
      }}
    >
      {loading ? (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: DIMENSIONS.spacing.sm 
        }}>
          <div 
            style={{
              width: 16,
              height: 16,
              border: '2px solid transparent',
              borderTop: '2px solid currentColor',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          {title}
        </div>
      ) : (
        children || title
      )}
    </button>
  );
};

export default Button;
