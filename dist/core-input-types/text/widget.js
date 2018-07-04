"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Text = function Text(props) {
    var _props$meta = props.meta,
        touched = _props$meta.touched,
        error = _props$meta.error,
        warning = _props$meta.warning;

    return _react2.default.createElement(
        "div",
        { className: "addon-text-widget-input-wrapper" },
        _react2.default.createElement("input", (0, _extends3.default)({ className: "form-control addon-text-widget-input" + (error && touched ? " has-error" : "") }, props.input, { type: "text", placeholder: props.label }))
    );
};

var widget = { widget: Text, type: "text", label: "Text" };

exports.default = widget;