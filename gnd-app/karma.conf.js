module.exports = function (config) {
  config.set({
    // other configurations like basePath, frameworks, etc.
    
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],

    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), // Output directory for coverage reports
      reports: ['lcovonly', 'text-summary'],  // Generates lcov report and text-summary for console
      fixWebpackSourcePaths: true
    },

    reporters: ['progress', 'coverage-istanbul'],

    browsers: ['ChromeHeadless', 'ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    }
  });
};
