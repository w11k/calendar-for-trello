'use strict';

var grunt = require('grunt');
var fabs = require('fabs');
var path = require('path');
var lodash = require('lodash');

module.exports = function () {
    var configFolder = path.resolve('./build-config');
    var fabsConfig = fabs.createConfig(configFolder);
    var fabsGruntConfig = fabsConfig.getGruntConfig();
    var fabsBuildConfig = fabsConfig.getBuildConfig();

    var customConfig = { };

    var gruntConfig = lodash.merge({}, fabsGruntConfig, customConfig);
    grunt.initConfig(gruntConfig);
};
