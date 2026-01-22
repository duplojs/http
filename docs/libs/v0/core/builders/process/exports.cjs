'use strict';

var builder = require('./builder.cjs');
var index = require('../../process/index.cjs');

builder.processBuilder.set("exports", ({ accumulator, }) => index.createProcess(accumulator));
