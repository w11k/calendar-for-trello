'use strict';

var grunt = require('grunt');
var fabs = require('fabs');
var path = require('path');
var lodash = require('lodash');

module.exports = function () {
  var configFolder = path.resolve('./build-config');
  var fabsConfig = fabs.getGruntConfig(configFolder);

  var customConfig = { };

  var config = lodash.merge({}, fabsConfig, customConfig);
  grunt.initConfig(config);
};
