"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Adjustment(props) {
    var operation = props.operation,
        price = props.price;
    //todo: make this less hardcoded.

    var message = "";
    if (operation === "add" || operation === "subtract") {
        price = (price / 100).toFixed(2);
    }
    switch (operation) {
        case "add":
            message = _react2.default.createElement(
                "span",
                null,
                "+ $",
                price
            );
            break;
        case "subtract":
            message = _react2.default.createElement(
                "span",
                null,
                "- $",
                price
            );

            break;
        case "multiply":
            message = _react2.default.createElement(
                "span",
                null,
                "+ $",
                price,
                "%"
            );

            break;
        case "divide":
            message = _react2.default.createElement(
                "span",
                null,
                "- $",
                price,
                "%"
            );
            break;
        default:
            message = " -- " + operation + " : " + price;
            break;
    }
    return _react2.default.createElement(
        "span",
        { className: "_price-adjustment-label" },
        message
    );
}

exports.default = Adjustment;
module.exports = exports.default;