"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CreditCardIcon = function CreditCardIcon(brand) {

    brand = brand.toLowerCase();

    console.log("brand", brand);

    switch (brand) {

        case 'visa':
            return _react2.default.createElement(
                "div",
                { className: "card visa" },
                _react2.default.createElement(
                    "p",
                    null,
                    "VISA"
                )
            );
        case 'master':
        case 'master card':
        case 'mastercard':
        case 'MasterCard':
            return _react2.default.createElement(
                "div",
                { className: "card mc" },
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement(
                    "p",
                    null,
                    "MasterCard"
                )
            );
        case 'discover':
            return _react2.default.createElement(
                "div",
                { className: "card discover" },
                _react2.default.createElement(
                    "p",
                    null,
                    "Discover"
                )
            );
        case 'amex':
        case 'american express':
        case 'American Express':
            return _react2.default.createElement(
                "div",
                { className: "card amex" },
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement("hr", null),
                _react2.default.createElement(
                    "svg",
                    { className: "svg", height: "100%", width: "100%" },
                    _react2.default.createElement(
                        "text",
                        { x: "11%", y: "45%", fill: "none", stroke: "#fff", strokeWidth: "1%" },
                        "AMERICAN"
                    )
                ),
                _react2.default.createElement(
                    "svg",
                    { className: "svg", height: "100%", width: "100%" },
                    _react2.default.createElement(
                        "text",
                        { x: "30%", y: "72%", fill: "none", stroke: "#fff", strokeWidth: "1%" },
                        "EXPRESS"
                    )
                )
            );
        default:
            return _react2.default.createElement(
                "div",
                { className: "card back" },
                _react2.default.createElement("span", null)
            );

    }
};

exports.default = CreditCardIcon;
module.exports = exports.default;