'use strict';

var base = require('./base.cjs');

const EmptyBodyController = base.createBodyController("empty");
function controlBodyAsEmpty() {
    return EmptyBodyController.create({});
}

exports.EmptyBodyController = EmptyBodyController;
exports.controlBodyAsEmpty = controlBodyAsEmpty;
