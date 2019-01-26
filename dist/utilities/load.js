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

var _reactRedux = require('react-redux');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Load = function (_React$Component) {
    (0, _inherits3.default)(Load, _React$Component);

    function Load(props) {
        (0, _classCallCheck3.default)(this, Load);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Load.__proto__ || Object.getPrototypeOf(Load)).call(this, props));

        _this.state = {
            type: _this.props.type || 'content',
            message: "Loading...",
            loadState: "loading"
        };
        return _this;
    }

    (0, _createClass3.default)(Load, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps, nextContext) {
            if (!nextProps.loading && this.props.finishLoading) {
                this.props.finishLoading();
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                loading = _props.loading,
                disableLoader = _props.disableLoader,
                className = _props.className;


            if (disableLoader === true) {
                return _react2.default.createElement('div', { className: 'page-loader-disabled' });
            } else if (loading) {
                return _react2.default.createElement(
                    'div',
                    { className: 'page-loader ' + (className || '') },
                    _react2.default.createElement(
                        'div',
                        { className: 'lds-ellipsis' },
                        _react2.default.createElement('div', null),
                        _react2.default.createElement('div', null),
                        _react2.default.createElement('div', null),
                        _react2.default.createElement('div', null)
                    )
                );
            } else {
                return _react2.default.createElement('div', { className: 'page-loader-done' });
            }
        }
    }]);
    return Load;
}(_react2.default.Component);

function mapStateToProps(state) {
    return {
        loading: state.loading,
        disabledLoader: state.disableLoader
    };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps)(Load);
module.exports = exports.default;