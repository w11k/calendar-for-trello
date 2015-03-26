'use strict';

module.exports = {

    build: {
        less: {
            enabled: false
        },
        sass: {
            enabled: true
        },
        bless: {
            enabled: false
        },
        spec: {
            runInPrepare: false
        },
        e2e: {
            runInDev: false,
            runInDist: false
        },
        server: {
            runInDist: true
        }
    },

    app: {
        files: {
            templates2js: [ ],
            translations: [ ],
            translations2js: [ ]
        }
    },

    vendor: {
        files: {
            js: [
                'angular/angular.js',
                'jquery/dist/jquery.js',
                'angular-bootstrap/ui-bootstrap.js',
                'angular-bootstrap/ui-bootstrap-tpls.js',
                'angular-animate/angular-animate.js',
                'angular-sanitize/angular-sanitize.js',
                'angular-ui-router/release/angular-ui-router.js',
                'ionic/release/js/ionic.js',
                'ionic/release/js/ionic-angular.js',
                'lodash/lodash.js',
                'angular-ui-bootstrap-datetimepicker/datetimepicker.js',
                'angular-xeditable/dist/js/xeditable.js',
                'moment/min/moment-with-locales.js',
                'ngDraggable/ngDraggable.js'


            ],
            js_mock: [
            ],
            js_spec: [
            ],
            js_e2e: [
            ],
            css: [
                'angular-bootstrap/bootstrap.css',
                'angular-ui-bootstrap-datetimepicker/datetimepicker.css',
                'angular-xeditable/dist/css/xeditable.css'

            ],
            assets: [
                'ionic/release/fonts/*'
            ]
        }
    }
};
