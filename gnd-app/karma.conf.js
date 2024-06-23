module.exports = function (config) {
    config.set({
    //   basePath: '',
    //   frameworks: ['jasmine', '@angular-devkit/build-angular', 'sinon'],

      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage-istanbul-reporter'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
     
      browsers: ['ChromeHeadless', 'ChromeHeadlessNoSandbox'], // Use ChromeHeadless instead of Chrome
      customLaunchers: {
        ChromeHeadlessNoSandbox: {
          base: 'ChromeHeadless',
          flags: ['--no-sandbox']
        }
      },
    });
  };