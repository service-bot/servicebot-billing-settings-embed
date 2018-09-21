'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFormattedDate = undefined;

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

function getFormattedDate(dateString) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    var date = new Date(dateString * 1000);
    if (date == 'Invalid Date') {
        date = new Date(dateString);
    }
    var dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var dayOfWeek = date.getDay();
    var day = date.getDate();
    var month = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var min = date.getMinutes();

    if (hour < 10) {
        hour = '0' + hour;
    }
    if (min < 10) {
        min = '0' + min;
    }

    var myDate = monthNames[month] + ' ' + day + ', ' + year;
    if (options.month) {
        return monthNames[month] + ', ' + year;
    }
    if (options.weekday) {
        myDate = dayNames[dayOfWeek] + ' ' + monthNames[month] + ' ' + day + ', ' + year;
    } else if (options.time) {
        myDate = monthNames[month] + ' ' + day + ', ' + year + ' - ' + hour + ':' + min;
    } else if (options.weekday && options.time) {
        myDate = dayNames[dayOfWeek] + ' ' + monthNames[month] + ' ' + day + ', ' + year + ' - ' + hour + ':' + min;
    }

    return myDate;
}

var DateFormat = function (_React$Component) {
    (0, _inherits3.default)(DateFormat, _React$Component);

    function DateFormat(props) {
        (0, _classCallCheck3.default)(this, DateFormat);
        return (0, _possibleConstructorReturn3.default)(this, (DateFormat.__proto__ || Object.getPrototypeOf(DateFormat)).call(this, props));
    }

    (0, _createClass3.default)(DateFormat, [{
        key: 'render',
        value: function render() {

            return _react2.default.createElement(
                'span',
                null,
                getFormattedDate(this.props.date, { month: this.props.month, weekday: this.props.weekday, time: this.props.time })
            );
        }
    }]);
    return DateFormat;
}(_react2.default.Component);

exports.getFormattedDate = getFormattedDate;
exports.default = DateFormat;