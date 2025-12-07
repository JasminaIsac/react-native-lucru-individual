module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './app',
            '@components': './components',
            '@utils': './utils',
            '@hooks': './hooks',
            '@assets': './assets',
            '@contexts': './contexts',
            '@constants': './constants',
            '@api': './api',
            '@theme': './theme'
          },
          extensions: [
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.android.js',
            '.android.tsx',
            '.ios.js',
            '.ios.tsx'
          ]
        }
      ], 
      'react-native-reanimated/plugin'
    ]
  };
};