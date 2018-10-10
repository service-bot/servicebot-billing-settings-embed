"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Adjustment(props) {
    var operation = props.operation,
        price = props.price,
        isText = props.isText,
        currency = props.currency;

    var formatter = new Intl.NumberFormat("en-US", { style: 'currency', currency: currency || "USD" }).format;

    //todo: make this less hardcoded.
    var message = "";
    if (operation === "add" || operation === "subtract") {
        price = formatter(price / 100);
    }
    switch (operation) {
        case "add":
            message = isText ? price + " Add-on" : _react2.default.createElement(
                "div",
                null,
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
            message = isText ? price + " Discount" : _react2.default.createElement(
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