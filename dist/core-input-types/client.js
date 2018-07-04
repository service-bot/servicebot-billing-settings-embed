"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPriceData = undefined;

var _widget = require("./checkbox/widget");

var _widget2 = _interopRequireDefault(_widget);

var _widget3 = require("./select/widget");

var _widget4 = _interopRequireDefault(_widget3);

var _widget5 = require("./text/widget");

var _widget6 = _interopRequireDefault(_widget5);

var _widget7 = require("./secure-string/widget");

var _widget8 = _interopRequireDefault(_widget7);

var _handleInputs = require("../widget-inputs/handleInputs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getWidgets = function getWidgets() {
    var widgets = [_widget2.default, _widget4.default, _widget6.default, _widget8.default];
    return widgets;
};

function getPriceData(currentPrice, properties) {
    if (properties) {
        var handlers = getWidgets().reduce(function (acc, widget) {
            acc[widget.type] = widget.handler;
            return acc;
        }, {});
        var newPrice = currentPrice;
        var adjustments = [];
        try {
            newPrice = (0, _handleInputs.getPrice)(properties, handlers, currentPrice);
            adjustments = (0, _handleInputs.getPriceAdjustments)(properties, handlers);
        } catch (e) {
            console.error(e);
        }
        return { total: newPrice, adjustments: adjustments };
    } else {
        return { total: 0, adjustments: [] };
    }
}

exports.getPriceData = getPriceData;
exports.default = getWidgets;