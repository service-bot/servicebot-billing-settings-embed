"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

var _reactRedux = require("react-redux");

var _reduxForm = require("redux-form");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Load = function (_React$Component) {
    (0, _inherits3.default)(Load, _React$Component);

    function Load(props) {
        (0, _classCallCheck3.default)(this, Load);

        var _this = (0, _possibleConstructorReturn3.default)(this, (Load.__proto__ || Object.getPrototypeOf(Load)).call(this, props));

        _this.state = {
            type: _this.props.type || 'content',
            message: "Loading...",
            loadState: "loading",
            show: false
        };
        return _this;
    }

    (0, _createClass3.default)(Load, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var self = this;
            var _props = this.props,
                timeout = _props.timeout,
                delayed = _props.delayed,
                show = _props.show;


            if (delayed !== false) {
                this.delayed = setTimeout(function () {
                    self.setState({
                        show: true
                    });
                }, 300);
            }

            if (this.props.timeout !== false) {
                this.timeout = setTimeout(function () {
                    self.setState({ message: "There seems to be a problem in processing your request. Please try again.", loadState: "done" });
                }, this.props.timeout || 10000);
            }
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            clearTimeout(this.timeout);
            clearTimeout(this.delayed);
        }
    }, {
        key: "render",
        value: function render() {
            var _state = this.state,
                timeout = _state.timeout,
                delayed = _state.delayed,
                show = _state.show,
                loading = _state.loading;

            if (show && loading) {
                return _react2.default.createElement(
                    "div",
                    { className: "loader" },
                    _react2.default.createElement(
                        "div",
                        { className: "lds-ellipsis" },
                        _react2.default.createElement("div", null),
                        _react2.default.createElement("div", null),
                        _react2.default.createElement("div", null),
                        _react2.default.createElement("div", null)
                    ),
                    this.props.children
                );
            } else {
                return _react2.default.createElement("div", null);
            }
        }
    }]);
    return Load;
}(_react2.default.Component);

function mapStateToProps(state) {
    return {
        loading: state.loading
    };
}

exports.default = (0, _reactRedux.connect)(mapStateToProps)(Load);
module.exports = exports.default;