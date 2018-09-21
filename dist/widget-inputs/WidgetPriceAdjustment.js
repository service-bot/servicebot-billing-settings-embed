"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _currencySymbolMap = require("currency-symbol-map");

var _currencySymbolMap2 = _interopRequireDefault(_currencySymbolMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Adjustment(props) {
    var operation = props.operation,
        price = props.price,
        isText = props.isText,
        currency = props.currency;

    var currencySymbol = currency ? (0, _currencySymbolMap2.default)(currency) : "$";
    //todo: make this less hardcoded.
    var message = "";
    if (operation === "add" || operation === "subtract") {
        price = (price / 100).toFixed(2);
    }
    switch (operation) {
        case "add":
            message = isText ? "" + currencySymbol + price + " Add-on" : _react2.default.createElement(
                "div",
                null,
                currencySymbol,
                price,
                " ",
                _react2.default.createElement(
                    "span",
                    { className: "request-form-price-adjust-discount" },
                    "Add-on"
                )
            );
            break;
        case "subtract":
            message = isText ? "" + currencySymbol + price + " Discount" : _react2.default.createElement(
                "div",
                null,
                "$",
                price,
                " ",
                _react2.default.createElement(
                    "span",
                    { className: "request-form-price-adjust-discount" },
                    "Discount"
                )
            );

            break;
        case "multiply":
            message = isText ? price + "% Increase" : _react2.default.createElement(
                "div",
                null,
                "$",
                price,
                "% ",
                _react2.default.createElement(
                    "span",
                    { className: "request-form-price-adjust-increase" },
                    "Increase"
                )
            );

            break;
        case "divide":
            message = isText ? price + "% Discount" : _react2.default.createElement(
                "div",
                null,
                "$",
                price,
                "% ",
                _react2.default.createElement(
                    "span",
                    { className: "request-form-price-adjust-decrease" },
                    "Discount"
                )
            );
            break;
        default:
            message = " -- " + operation + " : " + price;
            break;
    }
    if (isText) {
        return message;
    }
    return _react2.default.createElement(
        "div",
        { className: "request-form-price-adjustment-wrapper" },
        message
    );
}

exports.default = Adjustment;
module.exports = exports.default;