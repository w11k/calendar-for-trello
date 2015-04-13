'use strict';

module.exports = {

  build: {
    sass: {
      enabled: false
    },
    less: {
      enabled: true
    },
    blessed: {
      enabled: false
    },
    jshint: {
      runInDev: true,
      runInDist: true
    },
    bower: {
      runInDev: true,
      runInDist: true
    },
    spec: {
      runInDev: true,
      runInDist: true,
      browsers: ["PhantomJS"]
    },
    e2e: {
      runInDev: true,
      runInDist: true,
      browsers: ["PhantomJS"]
    }
  },

  app: {
    angular_module: {
      regular: 'w11kcal.app',
      withMocks: 'w11kcal.app.mock',
      templates: 'w11kcal.app.templates',
      translations: 'w11kcal.app.translations'
    }
  },

  vendor: {
    files: {
      js: [
        //'angular/angular.js',
          'ionic/release/js/ionic.bundle.js',

          'jquery/dist/jquery.js',
          'angular-bootstrap/ui-bootstrap.js',
          'angular-bootstrap/ui-bootstrap-tpls.js',
        //  'angular-animate/angular-animate.js',
        //  'angular-sanitize/angular-sanitize.js',
        //  'angular-ui-router/release/angular-ui-router.js',


          'lodash/lodash.js',
          'angular-bootstrap-datetimepicker/src/js/datetimepicker.js',
          'angular-xeditable/dist/js/xeditable.js',
          'moment/min/moment-with-locales.js',
          'ngDraggable/ngDraggable.js',
          'angular-loading-bar/build/loading-bar.js',
          'angular-ui-notification/dist/angular-ui-notification.min.js',
          'angular-local-storage/dist/angular-local-storage.js'
          //'ionic/release/js/ionic.js',
          //'ionic/release/js/ionic-angular.js'
          //'angular-bindonce/bindonce.js',
          //'w11k-dropdownToggle/dist/w11k-dropdownToggle.js',
          //'w11k-select/dist/w11k-select.js',

      ],
      js_mock: [
        // required to run spec tests
        'angular-mocks/angular-mocks.js'
      ],
      js_spec: [],
      js_e2e: [],
      css: [
          'ionic/release/css/ionic.css',
          'angular-bootstrap/bootstrap.css',
          'angular-ui-bootstrap-datetimepicker/datetimepicker.css',
          'angular-xeditable/dist/css/xeditable.css',
          'angular-loading-bar/build/loading-bar.css',
          'angular-ui-notification/dist/angular-ui-notification.min.css',
       //   'w11k-select/dist/w11k-select.less'
      ],
      assets: [
          'ionic/release/fonts/*'
      ],
        fonts: [
            'ionic/release/fonts/*'
        ]
    }
  }

};
