// Folosim doar Baloo pentru titluri
export const fonts = {
  title: 'Baloo2_700Bold',
};

// Greutăți de font (opțional, nu mai sunt neapărat necesare)
export const fontWeights = {
  regular: '400',
  bold: '700',
};

// Mărimile de font standardizate
export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 15,
  lg: 18,
  xl: 20,
  xxl: 22,
  xxxl: 26,
  title: 42,
};

// Înălțimi de linie standardizate
export const lineHeights = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 28,
  xxl: 34,
  title: 42,
};

// Presetări pentru text — doar titlul are font personalizat
export const textPresets = {
  // Titre mari
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.title,
    lineHeight: lineHeights.title,
  },

  // Headere implicite (folosesc fontul default al sistemului)
  headerLarge: {
    fontSize: fontSizes.xxl,
    marginBottom: 12,
    fontWeight: '700',
  },
  headerMedium: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    marginBottom: 8,
  },
  headerSmall: {
    fontSize: fontSizes.lg,
    marginBottom: 6,
    fontWeight: '700',
  },

  // Body text – fără fontFamily, deci default
  bodyLarge: {
    fontSize: fontSizes.lg,
  },
  bodyMedium: {
    fontSize: fontSizes.md,
  },
  bodySmall: {
    fontSize: fontSizes.sm,
  },

  bodyLargeBold: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  bodyMediumBold: {
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  bodySmallBold: {
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },

  noData: {
    fontSize: fontSizes.md,
  },

  tag: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },

  button: {
    fontSize: fontSizes.md,
    fontWeight: '700',
  },

  caption: {
    fontSize: fontSizes.xs,
  },

  dayNumber: {
    fontSize: fontSizes.xxl,
    fontWeight: '800',
  },
};
