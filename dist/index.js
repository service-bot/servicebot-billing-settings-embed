'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BillingSettings = exports.ServicebotBillingSettingsEmbed = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _ServicebotBillingSettings = require('./ServicebotBillingSettings');

var _ServicebotBillingSettings2 = _interopRequireDefault(_ServicebotBillingSettings);

var _reactHotLoader = require('react-hot-loader');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ReactDOM.render(<App />, document.getElementById('root'));

var BillingSettings = function BillingSettings(config) {
    _reactDom2.default.render(_react2.default.createElement(_ServicebotBillingSettings2.default, (0, _extends3.default)({}, config, { external: true })), config.selector);
};

exports.ServicebotBillingSettingsEmbed = _ServicebotBillingSettings2.default;
exports.BillingSettings = BillingSettings;


if (module.hot) {
    module.hot.accept('./ServicebotBillingSettings.js', function () {
        var NextApp = require('./ServicebotBillingSettings.js').default;
        _reactDom2.default.render(_react2.default.createElement(
            _reactHotLoader.AppContainer,
            null,
            _react2.default.createElement(NextApp, null)
        ), document.getElementById('root'));
    });
}