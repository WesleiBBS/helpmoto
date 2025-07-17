import React from 'react';

// Mapeamento de ícones do Ionicons para ícones Unicode/CSS
const iconMap = {
  'person-outline': '👤',
  'location-outline': '📍',
  'flag-outline': '🏁',
  'document-text-outline': '📝',
  'time-outline': '⏰',
  'card-outline': '💳',
  'call-outline': '📞',
  'construct-outline': '🔧',
  'flash-outline': '⚡',
  'ellipse-outline': '⭕',
  'car-outline': '⛽',
  'car-sport-outline': '🚗',
  'help-outline': '❓',
  'menu-outline': '☰',
  'close-outline': '✕',
  'search-outline': '🔍',
  'settings-outline': '⚙️',
  'notification-outline': '🔔',
  'home-outline': '🏠',
  'map-outline': '🗺️',
};

export const Ionicons = ({ name, size = 24, color = '#000', style, ...props }) => {
  const icon = iconMap[name] || '❓';
  
  return (
    <span
      style={{
        fontSize: size,
        color: color,
        display: 'inline-block',
        lineHeight: 1,
        ...style
      }}
      {...props}
    >
      {icon}
    </span>
  );
};

// Para compatibilidade, exportamos também como default
export default { Ionicons };
