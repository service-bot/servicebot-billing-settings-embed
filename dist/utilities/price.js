'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPriceValue = exports.serviceTypeFormatter = exports.getBillingType = exports.getPrice = exports.Price = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _currencySymbolMap = require('currency-symbol-map');

var _currencySymbolMap2 = _interopRequireDefault(_currencySymbolMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This is used to display Stripe amount values,
 * Since Stripe takes amount in cents, we want to convert it and display dollar value.
 */
function getPriceValue(value) {
    return '$' + (value / 100).toFixed(2);
}

function formatMoney(price, c, d, t) {
    var n = price;
    var cNew = isNaN(c = Math.abs(c)) ? 2 : c;
    var dNew = d == undefined ? "." : d;
    var tNew = t == undefined ? "," : t;
    var s = n < 0 ? "-" : "";
    var i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(cNew)));
    var j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + tNew : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + tNew) + (cNew ? dNew + Math.abs(n - i).toFixed(cNew).slice(2) : "");
};

var Price = function Price(props) {
    var price = formatMoney((props.value / 100).toFixed(2), ',', '.');
    var prefix = props.prefix || '$';
    return _react2.default.createElement(
        'span',
        null,
        prefix + price
    );
};

var getPrice = function getPrice(myService) {
    var serviceType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    console.log(myService);
    var serType = myService.type || serviceType;
    var prefix = (0, _currencySymbolMap2.default)(myService.payment_plan.currency);

    if (serType === "subscription") {
        return _react2.default.createElement(
            'span',
            null,
            _react2.default.createElement(Price, { value: myService.payment_plan.amount, prefix: prefix }),
            _react2.default.createElement(
                'span',
                null,
                myService.payment_plan.interval_count === 1 ? ' /' : ' / ' + myService.payment_plan.interval_count,
                ' ',
                ' ' + myService.payment_plan.interval
            )
        );
    } else if (serType === "one_time") {
        return _react2.default.createElement(
            'span',
            null,
            _react2.default.createElement(Price, { value: myService.amount, prefix: prefix })
        );
    } else if (serType === "custom") {
        return false;
    } else {
        return _react2.default.createElement(
            'span',
            null,
            _react2.default.createElement(Price, { value: myService.amount, prefix: prefix })
        );
    }
};
/**
 * To be deprecated after refactoring all code
 * @param myService - a service template record row
 * @returns {*}
 */
var getBillingType = function getBillingType(myService) {
    var serType = myService.type;

    if (serType === "subscription") {
        return "Subscription";
    } else if (serType === "one_time") {
        return "One-time";
    } else if (serType === "custom") {
        return "Ongoing";
    } else if (serType === "split") {
        return "Scheduled";
    } else {
        return "Other";
    }
};

/**
 * Takes a service template and returns the text from row.type after formatting
 * @param row - a service template record row
 * @returns {string}
 */
var serviceTypeFormatter = function serviceTypeFormatter(row) {
    var type = row.type;

    var text = type.replace(/_/g, " ");
    return text.charAt(0).toUpperCase() + text.slice(1);
};

exports.Price = Price;
exports.getPrice = getPrice;
exports.getBillingType = getBillingType;
exports.serviceTypeFormatter = serviceTypeFormatter;
exports.getPriceValue = getPriceValue;