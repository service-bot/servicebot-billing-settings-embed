'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CardSection = exports.BillingForm = exports.CreditCardForm = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

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

var _reactStripeElements = require('react-stripe-elements');

var _servicebotBaseForm = require('servicebot-base-form');

var _lodash = require('lodash');

var _reduxForm = require('redux-form');

var _buttons = require('../utilities/buttons.js');

var _buttons2 = _interopRequireDefault(_buttons);

var _reactRedux = require('react-redux');

var _creditCardIcons = require('../utilities/credit-card-icons.js');

var _creditCardIcons2 = _interopRequireDefault(_creditCardIcons);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CardSection = function (_React$Component) {
    (0, _inherits3.default)(CardSection, _React$Component);

    function CardSection() {
        (0, _classCallCheck3.default)(this, CardSection);
        return (0, _possibleConstructorReturn3.default)(this, (CardSection.__proto__ || Object.getPrototypeOf(CardSection)).apply(this, arguments));
    }

    (0, _createClass3.default)(CardSection, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'form-group', id: 'card-element' },
                _react2.default.createElement(_reactStripeElements.CardElement, { style: {
                        base: {
                            color: '#9B9B9B',
                            lineHeight: '16px',
                            fontFamily: 'Open Sans, Helvetica Neue',
                            fontSmoothing: 'antialiased',
                            fontSize: '14px',
                            fontWeight: '300',
                            background: '#FFFFFF',
                            '::placeholder': {
                                color: '#7f7f7f'
                            }
                        },
                        invalid: {
                            color: '#ff2e2e',
                            iconColor: '#ff2e2e',
                            lineHeight: '16px'
                        }
                    } })
            );
        }
    }]);
    return CardSection;
}(_react2.default.Component);

var BillingForm = function (_React$Component2) {
    (0, _inherits3.default)(BillingForm, _React$Component2);

    function BillingForm() {
        (0, _classCallCheck3.default)(this, BillingForm);
        return (0, _possibleConstructorReturn3.default)(this, (BillingForm.__proto__ || Object.getPrototypeOf(BillingForm)).apply(this, arguments));
    }

    (0, _createClass3.default)(BillingForm, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _reactStripeElements.StripeProvider,
                { apiKey: this.props.spk || "no_public_token" },
                _react2.default.createElement(
                    _reactStripeElements.Elements,
                    { fonts: [{
                            cssSrc: "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800"
                        }], id: 'payment-form' },
                    _react2.default.createElement(CreditCardForm, this.props)
                )
            );
        }
    }]);
    return BillingForm;
}(_react2.default.Component);

function BillingInfo(props) {
    console.log(props);
    var invalid = props.invalid,
        submitting = props.submitting,
        pristine = props.pristine;

    return _react2.default.createElement(
        'form',
        { className: 'mbf--funding-personal-info' },
        _react2.default.createElement(CardSection, null),
        _react2.default.createElement(_reduxForm.Field, { name: 'name', type: 'text', component: _servicebotBaseForm.inputField, placeholder: 'Name on Card' }),
        _react2.default.createElement(
            'button',
            { disabled: invalid || submitting || pristine, className: 'buttons _primary mbf--btn-update-funding-save', onClick: props.handleSubmit, type: 'submit' },
            'Save Card'
        )
    );
}

var CreditCardForm = function (_React$Component3) {
    (0, _inherits3.default)(CreditCardForm, _React$Component3);

    function CreditCardForm(props) {
        (0, _classCallCheck3.default)(this, CreditCardForm);

        var _this3 = (0, _possibleConstructorReturn3.default)(this, (CreditCardForm.__proto__ || Object.getPrototypeOf(CreditCardForm)).call(this, props));

        var state = {
            hasCard: false,
            loading: true,
            card: {},
            alerts: null,
            showForm: true
        };
        if (props.userFund) {
            state.hasCard = true;
            state.showForm = false;
            state.card = props.userFund.source.card;
        }
        _this3.state = state;
        _this3.submissionPrep = _this3.submissionPrep.bind(_this3);
        // this.checkIfUserHasCard = this.checkIfUserHasCard.bind(this);
        _this3.handleSuccessResponse = _this3.handleSuccessResponse.bind(_this3);
        _this3.handleFailureResponse = _this3.handleFailureResponse.bind(_this3);
        _this3.showPaymentForm = _this3.showPaymentForm.bind(_this3);
        _this3.hidePaymentForm = _this3.hidePaymentForm.bind(_this3);
        return _this3;
    }

    (0, _createClass3.default)(CreditCardForm, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var self = this;
            self.setState({
                loading: false
            });
        }
    }, {
        key: 'submissionPrep',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(values) {
                var token, message;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.props.setLoading(true);
                                _context.next = 3;
                                return this.props.stripe.createToken((0, _extends3.default)({}, values));

                            case 3:
                                token = _context.sent;

                                if (!token.error) {
                                    _context.next = 10;
                                    break;
                                }

                                message = token.error;

                                if (token.error.message) {
                                    message = token.error.message;
                                }
                                this.setState({ alerts: {
                                        type: 'danger',
                                        icon: 'times',
                                        message: message
                                    } });
                                this.props.setLoading(false);
                                throw token.error;

                            case 10:
                                return _context.abrupt('return', { user_id: this.props.uid, token_id: token.token.id });

                            case 11:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function submissionPrep(_x) {
                return _ref.apply(this, arguments);
            }

            return submissionPrep;
        }()

        // checkIfUserHasCard() {
        //     let self = this;
        //         Fetcher(`/api/v1/users/${self.props.uid}`).then(function (response) {
        //             if (!response.error) {
        //                 if (has(response, 'references.funds[0]') && has(response, 'references.funds[0].source.card')) {
        //                     let fund = get(response, 'references.funds[0]');
        //                     let card = get(response, 'references.funds[0].source.card');
        //                     self.setState({
        //                         loading: false,
        //                         displayName: response.name || response.email || "You",
        //                         hasCard: true,
        //                         fund: fund,
        //                         card: card,
        //                         personalInformation: {
        //                             name: card.name || "",
        //                             address_line1: card.address_line1 || "",
        //                             address_city: card.address_city || "",
        //                             address_state: card.address_state || "",
        //                         }
        //                     }, function () {
        //                     });
        //                 } else {
        //                     self.setState({
        //                         loading: false,
        //                         showForm: true
        //                     });
        //                 }
        //             } else {
        //                 self.setState({loading: false, hasCard: false});
        //             }
        //         });
        // }

    }, {
        key: 'handleSuccessResponse',
        value: function handleSuccessResponse(response) {
            //If the billing form is passed in a callback, call it.

            if (this.props.handleResponse) {
                this.props.handleResponse(response);
                //Otherwise, set own alert.
            } else {
                this.setState({ alerts: {
                        type: 'success',
                        icon: 'check',
                        message: 'Your card has been updated.'
                    } });
                //re-render
                // this.checkIfUserHasCard();
            }
            this.props.setLoading(false);
        }
    }, {
        key: 'handleFailureResponse',
        value: function handleFailureResponse(response) {
            if (response.error) {
                this.setState({ alerts: {
                        type: 'danger',
                        icon: 'times',
                        message: response.error
                    } });
            }
            this.props.setLoading(false);
        }
    }, {
        key: 'showPaymentForm',
        value: function showPaymentForm() {
            this.setState({ showForm: true });
        }
    }, {
        key: 'hidePaymentForm',
        value: function hidePaymentForm() {
            this.setState({ showForm: false });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            console.log(this.props.external, "EXT");
            var submissionRequest = {
                'method': 'POST',
                'url': this.props.url + '/api/v1/funds'
            };

            if (this.props.submitAPI) {
                submissionRequest.url = this.props.submitAPI;
            }

            var card = {};
            var _state = this.state,
                hasCard = _state.hasCard,
                displayName = _state.displayName;

            if (this.props.userFund) {
                hasCard = true;
                card = this.props.userFund.source.card;
            }

            console.log("current card", card);

            var _card = card,
                brand = _card.brand,
                last4 = _card.last4,
                exp_month = _card.exp_month,
                exp_year = _card.exp_year;


            var getCard = function getCard() {
                if (hasCard) {
                    return _react2.default.createElement(
                        'div',
                        { className: 'mbf--card-wrapper ' + (_this4.state.showForm && "show-form") },
                        _react2.default.createElement(
                            'div',
                            { className: 'mbf--card-display' },
                            _react2.default.createElement(
                                'div',
                                { className: 'mbf--card-number-holder' },
                                _react2.default.createElement(
                                    'span',
                                    { className: 'mbf--card-brand' },
                                    (0, _creditCardIcons2.default)(brand)
                                ),
                                brand,
                                ' ending in ',
                                _react2.default.createElement(
                                    'span',
                                    { className: 'mbf--card-last4' },
                                    last4
                                ),
                                _react2.default.createElement(
                                    'span',
                                    { className: 'mbf--card-date-holder' },
                                    'Expires',
                                    _react2.default.createElement(
                                        'span',
                                        { className: 'mbf--card-exp-month' },
                                        exp_month,
                                        ' / '
                                    ),
                                    _react2.default.createElement(
                                        'span',
                                        { className: 'mbf--card-exp-year' },
                                        exp_year
                                    )
                                )
                            ),
                            !_this4.state.showForm && _react2.default.createElement(
                                'div',
                                { className: 'mbf--update-funding-button-wrapper' },
                                _react2.default.createElement(
                                    'button',
                                    { className: 'buttons _primary _rounded mbf--btn-update-funding', onClick: _this4.showPaymentForm },
                                    'Update'
                                )
                            )
                        ),
                        _this4.state.showForm && _react2.default.createElement(
                            'div',
                            { className: 'mbf--update-funding-wrapper' },
                            _react2.default.createElement(
                                'div',
                                { className: 'mbf--funding-form-element' },
                                _react2.default.createElement(_servicebotBaseForm.ServicebotBaseForm, {
                                    form: BillingInfo,
                                    formProps: (0, _extends3.default)({}, _this4.props),
                                    initialValues: (0, _extends3.default)({}, _this4.state.personalInformation),
                                    submissionPrep: _this4.submissionPrep,
                                    submissionRequest: submissionRequest,
                                    successMessage: "Fund added successfully",
                                    handleResponse: _this4.handleSuccessResponse,
                                    handleFailure: _this4.handleFailureResponse,
                                    reShowForm: true,
                                    external: _this4.props.external,
                                    token: _this4.props.token })
                            ),
                            _react2.default.createElement(
                                'button',
                                { className: 'buttons _text mf--btn-cancel-update-funding', onClick: _this4.hidePaymentForm },
                                'Cancel'
                            )
                        )
                    );
                } else {
                    return _react2.default.createElement(
                        'div',
                        { className: 'mbf--card-wrapper no-card' },
                        _react2.default.createElement(
                            'div',
                            { className: 'mbf--update-funding-wrapper' },
                            _react2.default.createElement(
                                'div',
                                { className: 'mbf--funding-form-element' },
                                _react2.default.createElement(_servicebotBaseForm.ServicebotBaseForm, {
                                    form: BillingInfo,
                                    formProps: (0, _extends3.default)({}, _this4.props),
                                    initialValues: (0, _extends3.default)({}, _this4.state.personalInformation),
                                    submissionPrep: _this4.submissionPrep,
                                    submissionRequest: submissionRequest,
                                    successMessage: "Fund added successfully",
                                    handleResponse: _this4.handleSuccessResponse,
                                    handleFailure: _this4.handleFailureResponse,
                                    reShowForm: true,
                                    external: _this4.props.external,
                                    token: _this4.props.token })
                            )
                        )
                    );
                }
            };

            var getAlerts = function getAlerts() {
                if (_this4.state.alerts) {
                    return _react2.default.createElement(Alerts, { type: _this4.state.alerts.type, message: _this4.state.alerts.message,
                        position: { position: 'fixed', bottom: true }, icon: _this4.state.alerts.icon });
                }
            };

            return _react2.default.createElement(
                'div',
                { id: 'mbf--funding-form' },
                getAlerts(),
                getCard()
            );
        }
    }]);
    return CreditCardForm;
}(_react2.default.Component);

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        setLoading: function setLoading(is_loading) {
            dispatch({ type: "SET_LOADING", is_loading: is_loading });
        } };
};

exports.CreditCardForm = CreditCardForm = (0, _reactStripeElements.injectStripe)(CreditCardForm);
exports.CreditCardForm = CreditCardForm = (0, _reactRedux.connect)(null, mapDispatchToProps)(CreditCardForm);

exports.CreditCardForm = CreditCardForm;
exports.BillingForm = BillingForm;
exports.CardSection = CardSection;