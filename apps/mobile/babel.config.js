module.exports = function (api) {
  const isTest = api.env('test');
  return {
    presets: [
      'babel-preset-expo',
      ...(isTest ? ['react-native-css/babel'] : []),
    ],
  };
};
