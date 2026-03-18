'use strict';

var makeRouteFolder = require('./makeRouteFolder.cjs');
var makeRouteFile = require('./makeRouteFile.cjs');
var plugin = require('./plugin.cjs');



exports.makeRouteFolder = makeRouteFolder.makeRouteFolder;
exports.MissingSelectedStaticFileError = makeRouteFile.MissingSelectedStaticFileError;
exports.SelectedStaticFileIsNotFileError = makeRouteFile.SelectedStaticFileIsNotFileError;
exports.makeRouteFile = makeRouteFile.makeRouteFile;
exports.StaticPluginError = plugin.StaticPluginError;
exports.staticPlugin = plugin.staticPlugin;
