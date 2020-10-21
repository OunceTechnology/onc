module.exports = {
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-partial-application',
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    // [
    //   '@babel/plugin-transform-runtime',
    //   {
    //     regenerator: true,
    //     useESModules: true,
    //   },
    // ],
  ],
};
