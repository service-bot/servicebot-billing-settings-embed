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

var _managementForm = require('./forms/management-form.js');

var _managementForm2 = _interopRequireDefault(_managementForm);

var _reactRedux = require('react-redux');

var _redux = require('redux');

var _reduxForm = require('redux-form');

var _load = require('./utilities/load.js');

var _load2 = _interopRequireDefault(_load);

require('../scss/main.scss');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import './App.css';
var App = function (_Component) {
    (0, _inherits3.default)(App, _Component);

    function App() {
        (0, _classCallCheck3.default)(this, App);
        return (0, _possibleConstructorReturn3.default)(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
    }

    (0, _createClass3.default)(App, [{
        key: 'render',
        value: function render() {

            var options = function options() {
                var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { currency: { value: "usd" } };
                var action = arguments[1];

                switch (action.type) {
                    case 'SET_CURRENCY':
                        return action.filter;
                    default:
                        return state;
                }
            };
            var loadingReducer = function loadingReducer() {
                var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                var action = arguments[1];

                switch (action.type) {
                    case "SET_LOADING":
                        return action.is_loading;
                    default:
                        return state;
                }
            };

            var store = (0, _redux.createStore)((0, _redux.combineReducers)({
                options: options,
                disableLoader: this.props.disableLoader || false,
                loading: loadingReducer,
                form: _reduxForm.reducer
            }));
            return _react2.default.createElement(
                'div',
                { className: 'App' },
                _react2.default.createElement(
                    _reactRedux.Provider,
                    { store: store },
                    _react2.default.createElement(_managementForm2.default, this.props)
                )
            );
        }
    }]);
    return App;
}(_react.Component);

exports.default = App;
module.exports = exports.default;