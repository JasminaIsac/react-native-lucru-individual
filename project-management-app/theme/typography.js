// import { useFonts } from '@expo-google-fonts/raleway/useFonts';
// import { Raleway_100Thin } from '@expo-google-fonts/raleway/100Thin';
// import { Raleway_200ExtraLight } from '@expo-google-fonts/raleway/200ExtraLight';
// import { Raleway_300Light } from '@expo-google-fonts/raleway/300Light';
// import { Raleway_400Regular } from '@expo-google-fonts/raleway/400Regular';
// import { Raleway_500Medium } from '@expo-google-fonts/raleway/500Medium';
// import { Raleway_600SemiBold } from '@expo-google-fonts/raleway/600SemiBold';
// import { Raleway_700Bold } from '@expo-google-fonts/raleway/700Bold';
// import { Raleway_800ExtraBold } from '@expo-google-fonts/raleway/800ExtraBold';
// import { Raleway_900Black } from '@expo-google-fonts/raleway/900Black';

// export default () => {

//   let [fontsLoaded] = useFonts({
//     Raleway_100Thin, 
//     Raleway_200ExtraLight, 
//     Raleway_300Light, 
//     Raleway_400Regular, 
//     Raleway_500Medium, 
//     Raleway_600SemiBold, 
//     Raleway_700Bold, 
//     Raleway_800ExtraBold, 
//     Raleway_900Black,
//   });

//   if (!fontsLoaded) {
//     return null;
//   }
// }

// Definirea fonturilor disponibile în aplicație
export const fonts = {
  title: 'Baloo2_700Bold',
  
  headers: {
    light: 'Raleway_300Light',
    regular: 'Raleway_400Regular',
    medium: 'Raleway_500Medium',
    semiBold: 'Raleway_600SemiBold',
    bold: 'Raleway_700Bold',
    extraBold: 'Raleway_800ExtraBold',
    black: 'Raleway_900Black',
  },
  body: {
    light: 'EncodeSans_300Light',
    regular: 'EncodeSans_400Regular',
    medium: 'EncodeSans_500Medium',
    semiBold: 'EncodeSans_600SemiBold',
    bold: 'EncodeSans_700Bold',
    extraBold: 'EncodeSans_800ExtraBold',
  }
};

// Greutățile disponibile pentru fonturi
export const fontWeights = {
  light: '300',
  regular: '400',
  medium: '500',
  semiBold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
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

// Înălțimile de linie standardizate
export const lineHeights = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  xxl: 36,
  title: 42,
};

// Presetări pentru text comune
export const textPresets = {
  // Headere
  headerLarge: {
    fontFamily: fonts.headers.extraBold,
    fontSize: fontSizes.xxl,
    marginBottom: 12,
  },
  headerMedium: {
    fontFamily: fonts.headers.extraBold,
    fontSize: fontSizes.xl,
    marginBottom: 8,
  },
  headerSmall: {
    fontFamily: fonts.headers.extraBold,
    fontSize: fontSizes.lg,
    marginBottom: 6,
  },
  
  // Text pentru conținut
  bodyLarge: {
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.lg,
  },
  bodyMedium: {
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.md,
  },
  bodySmall: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.sm,
  },

  bodyLargeBold: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.lg,
  },
  bodyMediumBold: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.md,
  },
  bodySmallBold: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.sm,
  },
  noData: {
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.md,
  },
  tag: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.sm,
  },
  

  // Elemente speciale
  button: {
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.md,
  },
  caption: {
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.xs,
  },
  title: {
    fontFamily: fonts.title,
    fontSize: fontSizes.title,
    lineHeight: lineHeights.title,
  },

  dayNumber: {
    fontFamily: fonts.body.extraBold,
    fontSize: fontSizes.xxl,
  },
}; 