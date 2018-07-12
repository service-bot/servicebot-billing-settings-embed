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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Alerts = function (_React$Component) {
    (0, _inherits3.default)(Alerts, _React$Component);

    function Alerts(props) {
        (0, _classCallCheck3.default)(this, Alerts);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Alerts.__proto__ || Object.getPrototypeOf(Alerts)).call(this, props));

        _this.state = {
            alert: {
                type: _this.props.type || 'info',
                message: _this.props.message || 'Empty Message',
                icon: _this.props.icon || 'check-circle'
            }
        };

        if (_this.props.position) {
            _this.setState({
                position: {
                    position: _this.props.position.position || 'relative',
                    bottom: _this.props.position.bottom || false
                }
            });
        }

        _this.dismiss = _this.dismiss.bind(_this);
        return _this;
    }

    (0, _createClass3.default)(Alerts, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var self = this;
            if (nextProps.message != this.state.alert.message || !this.state.alert.message) {
                self.setState({
                    alert: {
                        type: nextProps.type || 'info',
                        message: nextProps.message || 'Empty Message',
                        icon: nextProps.icon || 'check-circle'
                    }
                }, function () {});
            }
        }
    }, {
        key: 'dismiss',
        value: function dismiss() {
            this.setState({ alert: {} });
        }
    }, {
        key: 'render',
        value: function render() {

            if (this.state.alert.message) {

                var type = this.state.alert.type;
                var message = this.state.alert.message;
                var icon = this.state.alert.icon;
                var style = { color: "red" };
                if (this.state.position && this.state.position.position == 'fixed') {
                    style.position = 'fixed';
                    style.left = '0px';
                    style.width = '100%';
                    style.zIndex = 99999;
                    style.marginBottom = '0px';
                    if (this.state.position.bottom) {
                        style.bottom = '0px';
                    } else {
                        style.top = '0px';
                    }
                }

                return _react2.default.createElement(
                    'div',
                    { className: 'alert alert-' + type, role: 'alert', style: style },
                    _react2.default.createElement(
                        'span',
                        null,
                        message
                    )
                );
            }

            return _react2.default.createElement('span', null);
        }
    }]);
    return Alerts;
}(_react2.default.Component);

exports.default = Alerts;