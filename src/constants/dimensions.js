// Web version - usando window dimensions
const getWindowDimensions = () => {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  return {
    width: 1200,
    height: 800
  };
};

const { width, height } = getWindowDimensions();

export const DIMENSIONS = {
  window: {
    width,
    height
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 28,
    header: 32
  },
  iconSize: {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48
  }
};

