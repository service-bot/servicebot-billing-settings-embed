"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactTagsinput = require("react-tagsinput");

var _reactTagsinput2 = _interopRequireDefault(_reactTagsinput);

var _widgetHandler = require("./widgetHandler");

var _widgetHandler2 = _interopRequireDefault(_widgetHandler);

var _WidgetPricingInput = require("../../widget-inputs/WidgetPricingInput.js");

var _WidgetPricingInput2 = _interopRequireDefault(_WidgetPricingInput);

var _WidgetPriceAdjustment = require("../../widget-inputs/WidgetPriceAdjustment");

var _WidgetPriceAdjustment2 = _interopRequireDefault(_WidgetPriceAdjustment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tags = function Tags(props) {
    return _react2.default.createElement(
        "div",
        { className: "form-group form-group-flex addon-options-widget-config-input-wrapper" },
        _react2.default.createElement(
            "label",
            { className: "control-label form-label-flex-md addon-options-widget-config-input-label" },
            "Available Options"
        ),
        _react2.default.createElement(
            "div",
            { className: "form-input-flex" },
            _react2.default.createElement(_reactTagsinput2.default, (0, _extends3.default)({ className: "addon-options-widget-config-input react-tagsinput",
                inputProps: { placeholder: 'Add Options' } }, props.input, { value: props.input.value || [] }))
        )
    );
};

//todo: all the imports from the main app will result in duplicate code.... need to fix this!

var SelectPricing = function (_React$Component) {
    (0, _inherits3.default)(SelectPricing, _React$Component);

    function SelectPricing(props) {
        (0, _classCallCheck3.default)(this, SelectPricing);

        var _this = (0, _possibleConstructorReturn3.default)(this, (SelectPricing.__proto__ || Object.getPrototypeOf(SelectPricing)).call(this, props));

        _this.handleChange = _this.handleChange.bind(_this);
        _this.handlePercentPriceChange = _this.handlePercentPriceChange.bind(_this);
        _this.state = props.configValue && props.configValue.pricing && (0, _typeof3.default)(props.configValue.pricing.value) === 'object' ? props.configValue.pricing.value : {};
        return _this;
    }

    (0, _createClass3.default)(SelectPricing, [{
        key: "componentDidUpdate",
        value: function componentDidUpdate(prevProps, prevState) {
            var self = this;
            if (prevProps.configValue && prevProps.configValue.value && prevProps.configValue.value.length > this.props.configValue.value.length) {
                var propsToRemove = prevProps.configValue.value.filter(function (prop) {
                    return self.props.configValue.value.indexOf(prop) < 0;
                });
                var newState = propsToRemove.reduce(function (acc, prop) {
                    acc[prop] = undefined;
                    return acc;
                }, {});
                this.setState(newState, function () {
                    self.props.input.onChange(self.state);
                });
            }
        }
    }, {
        key: "handleChange",
        value: function handleChange(name) {
            var self = this;
            return function (floatvalue) {
                self.setState((0, _defineProperty3.default)({}, name, floatvalue), function () {
                    self.props.input.onChange(self.state);
                });
            };
        }
    }, {
        key: "handlePercentPriceChange",
        value: function handlePercentPriceChange(e, maskedValue, floatvalue) {
            var name = e.target.name;
            var self = this;
            this.setState((0, _defineProperty3.default)({}, name, floatvalue), function () {
                self.props.input.onChange(self.state);
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _props = this.props,
                input = _props.input,
                configValue = _props.configValue;

            var self = this;
            var operation = configValue && configValue.pricing && configValue.pricing.operation;
            var pricingValue = configValue && configValue.pricing && configValue.pricing.value;
            return _react2.default.createElement(
                "div",
                { className: "addon-options-widget-price-inputs-wrapper" },
                configValue ? configValue.value && configValue.value.map(function (option, index) {
                    var input = {
                        onChange: self.handleChange(option),
                        name: option,
                        value: pricingValue && pricingValue[option]
                    };

                    return _react2.default.createElement(
                        "div",
                        null,
                        option,
                        " : ",
                        _react2.default.createElement(_WidgetPricingInput2.default, { input: input, operation: operation })
                    );
                }) : _react2.default.createElement(
                    "span",
                    { className: "addon-widget-price-tip" },
                    "Add some available options above"
                )
            );
        }
    }]);
    return SelectPricing;
}(_react2.default.Component);

var SelectWidget = function SelectWidget(props) {
    var input = props.input,
        configValue = props.configValue,
        label = props.label,
        currency = props.currency,
        _props$meta = props.meta,
        touched = _props$meta.touched,
        error = _props$meta.error,
        warning = _props$meta.warning;

    return _react2.default.createElement(
        "div",
        { className: "form-group form-group-flex addon-options-widget-default-value-wrapper" },
        label && _react2.default.createElement(
            "label",
            { className: "control-label _value-label" },
            label
        ),
        _react2.default.createElement(
            "div",
            { className: "form-input-flex _value-input-wrapper" },
            _react2.default.createElement(
                "select",
                (0, _extends3.default)({ className: "form-control _value-select" + (error && touched ? " has-error" : "") }, input),
                _react2.default.createElement(
                    "option",
                    { key: "0-default", value: "" },
                    "Choose One"
                ),
                configValue && configValue.value && configValue.value.map(function (option, index) {
                    var price = configValue.pricing && configValue.pricing.value && configValue.pricing.value[option];
                    return _react2.default.createElement(
                        "option",
                        { key: index, value: option },
                        price && configValue.pricing.operation ? option + " - " + (0, _WidgetPriceAdjustment2.default)({ currency: currency, price: price, operation: configValue.pricing.operation, isText: true }) : "" + option
                    );
                })
            )
        )
    );
};

var widget = {
    widget: SelectWidget,
    type: "select",
    label: "Select",
    config: Tags,
    pricing: SelectPricing,
    handler: _widgetHandler2.default
};

exports.default = widget;
module.exports = exports.default;