'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _load = require('./load.js');

var _load2 = _interopRequireDefault(_load);

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require("lodash");

var Buttons = function (_React$Component) {
    (0, _inherits3.default)(Buttons, _React$Component);

    function Buttons(props) {
        (0, _classCallCheck3.default)(this, Buttons);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Buttons.__proto__ || Object.getPrototypeOf(Buttons)).call(this, props));

        _this.state = {
            containerClass: _this.props.containerClass || '',
            buttonClass: 'btn btn-default btn-rounded ' + _this.props.buttonClass || 'btn btn-default btn-rounded',
            btnType: _this.props.btnType || 'default',
            text: _this.props.text || 'Button',
            size: _this.props.size || 'md',
            position: _this.props.position || 'right',
            loading: _this.props.loading || false,
            success: _this.props.success || false,
            disabled: _this.props.disabled || false,
            style: _this.props.style || {},
            hover: false
        };

        _this.handleClick = _this.handleClick.bind(_this);
        _this.hover = _this.hover.bind(_this);
        _this.unHover = _this.unHover.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(Buttons, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.loading === true) {
                this.setState({ loading: true });
            } else {
                this.setState({ loading: false });
            }
            if (nextProps.text != this.state.text) {
                this.setState({ text: nextProps.text });
            }
            if (nextProps.disabled === true) {
                this.setState({ disabled: true });
            } else {
                this.setState({ disabled: false });
            }
            if (nextProps.success === true) {
                this.setState({ success: true });
            } else {
                this.setState({ success: false });
            }
        }
    }, {
        key: 'handleClick',
        value: function handleClick(e) {
            if (this.props.preventDefault !== false) {
                e.preventDefault();
            }
            if (this.props.onClick) {
                this.props.onClick(e);
            }
        }
    }, {
        key: 'success',
        value: function success() {
            var self = this;
            setTimeout(function () {
                self.setState({ success: false });
            }, 3000);

            var style = { color: '#8BC34A' };
            if (this.state.systemOptions) {
                var options = this.state.systemOptions;
                style.color = _.get(options, 'button_success_icon_color.value', '#8BC34A');
            }
            return _react2.default.createElement('span', { style: style, className: 'ajax-response success' });
        }
    }, {
        key: 'hover',
        value: function hover() {
            this.setState({ hover: true });
        }
    }, {
        key: 'unHover',
        value: function unHover() {
            this.setState({ hover: false });
        }
    }, {
        key: 'render',
        value: function render() {

            var btnStyle = { border: 'none' };
            if (this.props.options) {
                var options = this.props.options;
                var hover = this.state.hover;
                if (this.state.btnType == 'default') {
                    if (!hover) {
                        btnStyle.backgroundColor = _.get(options, 'button_default_color.value', '#cccccc');
                        btnStyle.color = _.get(options, 'button_default_text_color.value', '#000000');
                    } else {
                        btnStyle.backgroundColor = _.get(options, 'button_default_hover_color.value', '#dddddd');
                        btnStyle.color = _.get(options, 'button_default_text_color.value', '#000000');
                    }
                } else if (this.state.btnType == 'primary') {
                    if (!hover) {
                        btnStyle.backgroundColor = _.get(options, 'button_primary_color.value', '#2980b9');
                        btnStyle.color = _.get(options, 'button_primary_text_color.value', '#ffffff');
                    } else {
                        btnStyle.backgroundColor = _.get(options, 'button_primary_hover_color.value', '#3498db');
                        btnStyle.color = _.get(options, 'button_primary_text_color.value', '#ffffff');
                    }
                } else if (this.state.btnType == 'info') {
                    if (!hover) {
                        btnStyle.backgroundColor = _.get(options, 'button_info_color.value', '#00BCD4');
                        btnStyle.color = _.get(options, 'button_info_text_color.value', '#000000');
                    } else {
                        btnStyle.backgroundColor = _.get(options, 'button_info_hover_color.value', '#26C6DA');
                        btnStyle.color = _.get(options, 'button_info_text_color.value', '#000000');
                    }
                } else if (this.state.btnType == 'danger') {
                    if (!hover) {
                        btnStyle.backgroundColor = _.get(options, 'btn_danger_do_not_change_color.value', '#d32f2f');
                        btnStyle.color = _.get(options, 'button_danger_do_not_change_color.value', '#ffffff');
                    } else {
                        btnStyle.backgroundColor = _.get(options, 'button_danger_do_not_change_color.value', '#000000');
                        btnStyle.color = _.get(options, 'button_danger_do_not_change_color.value', '#ffffff');
                    }
                } else if (this.state.btnType == 'link') {}
            }

            return _react2.default.createElement(
                'div',
                { className: 'react-buttons ' + this.state.position + ' ' + this.state.containerClass },
                this.state.loading === true && _react2.default.createElement(_load2.default, { type: 'button' }),
                this.state.success === true && this.success(),
                _react2.default.createElement(
                    'button',
                    { className: this.state.buttonClass + ' btn-' + this.state.size,
                        disabled: this.state.loading,
                        style: this.state.style ? _.merge(this.state.style, btnStyle) : btnStyle,
                        onClick: this.handleClick,
                        type: this.props.type, value: this.props.value,
                        onMouseEnter: this.hover, onMouseLeave: this.unHover },
                    this.state.text || this.props.children
                )
            );
        }
    }]);
    return Buttons;
}(_react2.default.Component);

exports.default = (0, _reactRedux.connect)(function (state) {
    return { options: state.options };
})(Buttons);