"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _defineProperty2 = require("babel-runtime/helpers/defineProperty");

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require("babel-runtime/helpers/inherits");

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _handleInputs = require("./handleInputs");

var _reactRedux = require("react-redux");

var _currencySymbolMap = require("currency-symbol-map");

var _currencySymbolMap2 = _interopRequireDefault(_currencySymbolMap);

var _reactNumberFormat = require("react-number-format");

var _reactNumberFormat2 = _interopRequireDefault(_reactNumberFormat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WidgetPricingInput = function (_React$Component) {
    (0, _inherits3.default)(WidgetPricingInput, _React$Component);

    function WidgetPricingInput(props) {
        (0, _classCallCheck3.default)(this, WidgetPricingInput);

        var _this = (0, _possibleConstructorReturn3.default)(this, (WidgetPricingInput.__proto__ || Object.getPrototypeOf(WidgetPricingInput)).call(this, props));

        _this.state = {};

        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(WidgetPricingInput, [{
        key: "handleChange",
        value: function handleChange(isCents) {
            var self = this;
            return function (_ref, e) {
                var value = _ref.value;

                var name = e.target.name;
                var parsedValue = isCents ? (0, _handleInputs.toCents)(value) : value;
                self.setState((0, _defineProperty3.default)({}, name, parsedValue), function () {
                    self.props.input.onChange(self.state[name]);
                });
            };
        }
    }, {
        key: "render",
        value: function render() {
            //renders a number input or a currency input based on the operation type
            var self = this;
            var props = this.props;
            var options = props.options,
                operation = props.operation,
                _props$input = props.input,
                name = _props$input.name,
                value = _props$input.value,
                onChange = _props$input.onChange;

            var prefix = options.currency ? (0, _currencySymbolMap2.default)(options.currency.value) : '';

            if (operation == 'add' || operation == 'subtract') {
                var price = value / 100;
                return _react2.default.createElement(_reactNumberFormat2.default, { className: "form-control addon-checkbox-widget-price-input", name: name,
                    prefix: prefix, decimalSeparator: ".", thousandSeparator: ",", decimalScale: "2",
                    allowNegative: false,
                    fixedDecimalScale: false,
                    onValueChange: this.handleChange(true), value: price
                });
            } else if (operation == 'divide' || operation == 'multiply') {
                return _react2.default.createElement(_reactNumberFormat2.default, { className: "form-control addon-checkbox-widget-price-input", name: name,
                    decimalSeparator: ".", decimalScale: 0, suffix: "%", allowNegative: false,
                    onValueChange: this.handleChange(false), value: value
                })
                // <input {...props.input} type="number" className="form-control addon-checkbox-widget-price-input"/>
                ;
            } else {
                return _react2.default.createElement(
                    "span",
                    { className: "addon-widget-price-tip" },
                    "Select a pricing type"
                );
            }
        }
    }]);
    return WidgetPricingInput;
}(_react2.default.Component);

var mapStateToProps = function mapStateToProps(state) {
    return {
        options: state.options
    };
};
exports.default = (0, _reactRedux.connect)(mapStateToProps)(WidgetPricingInput);