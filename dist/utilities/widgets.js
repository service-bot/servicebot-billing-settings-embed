"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PriceBreakdown = exports.WidgetList = exports.RenderWidget = undefined;

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reduxForm = require("redux-form");

var _servicebotBaseForm = require("servicebot-base-form");

var _client = require("../core-input-types/client");

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var values = require('object.values');
if (!Object.values) {
    values.shim();
}
var PriceOperation = function PriceOperation(props) {
    var input = props.input;

    return _react2.default.createElement(
        "select",
        input,
        _react2.default.createElement(
            "option",
            { value: "add" },
            "Add"
        ),
        _react2.default.createElement(
            "option",
            { value: "subtract" },
            "Subtract"
        ),
        _react2.default.createElement(
            "option",
            { value: "divide" },
            "Percent Decrease"
        ),
        _react2.default.createElement(
            "option",
            { value: "multiply" },
            "Percent Increase"
        )
    );
};

var RenderWidget = function RenderWidget(props) {
    var showPrice = props.showPrice,
        member = props.member,
        widgetType = props.widgetType,
        configValue = props.configValue,
        defaultWidgetValue = props.defaultWidgetValue;


    var widget = (0, _client2.default)().find(function (widgetToCheck) {
        return widgetToCheck.type === widgetType;
    });
    if (!widget) {
        console.error("widget does not exist ", widgetType);
    }
    return _react2.default.createElement(
        "div",
        null,
        _react2.default.createElement(
            _reduxForm.FormSection,
            { name: member + ".config" },
            widget.config && _react2.default.createElement(_reduxForm.Field, { name: "value", component: widget.config }),
            widget.pricing && showPrice && _react2.default.createElement(
                "div",
                { className: "addon-widget-has-pricing" },
                _react2.default.createElement(
                    _reduxForm.FormSection,
                    { name: "pricing" },
                    _react2.default.createElement(_reduxForm.Field, { name: "operation", component: _servicebotBaseForm.selectField, label: "Apply Price Change",
                        options: [{ id: "add", name: "Add to base price" }, { id: "subtract", name: "Subtract from base price" }, { id: "multiply", name: "Percent add to base price" }, { id: "divide", name: "Percent off from base price" }] }),
                    _react2.default.createElement(
                        "div",
                        { className: "addon-widget-pricing-inputs-wrapper" },
                        _react2.default.createElement(
                            "label",
                            { className: "control-label form-label-flex-md addon-widget-pricing-input-label" },
                            "Add-On Pricing"
                        ),
                        _react2.default.createElement(_reduxForm.Field, { name: "value", configValue: configValue, component: widget.pricing })
                    )
                )
            )
        ),
        widget.widget && _react2.default.createElement(_reduxForm.Field, { name: member + ".data.value", configValue: configValue, component: widget.widget })
    );
};

var PriceBreakdown = function PriceBreakdown(props) {
    var inputs = props.inputs;

    var widgets = (0, _client2.default)().reduce(function (acc, widget) {
        acc[widget.type] = widget;
        return acc;
    }, {});
    var map = {
        add: "+",
        subtract: "-",
        "multiply": "+",
        "divide": "-"
    };
    var breakdown = inputs.reduce(function (acc, input) {
        if (input.config && input.config.pricing && widgets[input.type].handler.priceHandler && widgets[input.type].handler.priceHandler(input.data, input.config)) {
            acc.push(_react2.default.createElement(
                "p",
                { className: "_item" },
                _react2.default.createElement(
                    "span",
                    { className: "_label" },
                    input.prop_label
                ),
                _react2.default.createElement(
                    "span",
                    { className: "_value_wrap" },
                    _react2.default.createElement(
                        "span",
                        { className: "_prefix" },
                        map[input.config.pricing.operation]
                    ),
                    _react2.default.createElement(
                        "span",
                        { className: "_value" },
                        widgets[input.type].handler.priceHandler(input.data, input.config)
                    )
                )
            ));
        }
        return acc;
    }, []);

    if (breakdown.length == 0) {
        breakdown = _react2.default.createElement("div", null);
    }
    return _react2.default.createElement(
        "div",
        null,
        breakdown
    );
};
var WidgetList = function WidgetList(props) {
    return _react2.default.createElement(_reduxForm.Field, { name: props.name, id: props.name, component: _servicebotBaseForm.selectField,
        options: (0, _client2.default)(), valueKey: "type", labelKey: "label"
    });
};

exports.RenderWidget = RenderWidget;
exports.WidgetList = WidgetList;
exports.PriceBreakdown = PriceBreakdown;