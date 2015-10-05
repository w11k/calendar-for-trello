'use strict';

var grunt = require('grunt');
var fabs = require('fabs');
var path = require('path');
var lodash = require('lodash');
var modRewrite = require('connect-modrewrite');

module.exports = function () {
    var configFolder = path.resolve('./build-config');
    var fabsConfig = fabs.createConfig(configFolder);
    var fabsGruntConfig = fabsConfig.getGruntConfig();
    var fabsBuildConfig = fabsConfig.getBuildConfig();

    var customConfig = {};

    var fabsMiddleware = fabsGruntConfig.connect.dev.options.middleware;

    fabsGruntConfig.connect.dev.options.middleware = function (connect, options) {
        var Middlewares = fabsMiddleware(connect, options);
        Middlewares.unshift(modRewrite(['^[^\\.]*$ /index.html [L]']));
        return Middlewares;
    };

    var gruntConfig = lodash.merge({}, fabsGruntConfig, customConfig);
    grunt.initConfig(gruntConfig);
};
