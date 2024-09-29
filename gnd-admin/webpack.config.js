const Dotenv = require('dotenv-webpack');

module.exports = {
  plugins: [
    new Dotenv()
  ]
};
// const Dotenv = require('dotenv-webpack');

// module.exports = function (config) {
//   config.set({
//     frameworks: ['jasmine', '@angular-devkit/build-angular'],
//     plugins: [
//       require('karma-jasmine'),
//       require('karma-chrome-launcher'),
//       require('karma-jasmine-html-reporter'),
//       require('karma-coverage'),
//       require('@angular-devkit/build-angular/plugins/karma'),
//       new Dotenv() // Use dotenv for environment variables
//     ],
//   });
// };
