'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

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

var _servicebotBaseForm = require('servicebot-base-form');

var _price = require('../utilities/price.js');

var _dateFormat = require('../utilities/date-format.js');

var _dateFormat2 = _interopRequireDefault(_dateFormat);

var _billingSettingsForm = require('./billing-settings-form.js');

var _reactStripeElements = require('react-stripe-elements');

var _reactRedux = require('react-redux');

var _editPropertiesForm = require('./edit-properties-form.js');

var _TierChooser = require('./TierChooser');

var _TierChooser2 = _interopRequireDefault(_TierChooser);

var _widgets = require('../utilities/widgets');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PriceSummary(props) {
    var instance = props.instance,
        template = props.template;


    return _react2.default.createElement(
        'div',
        { className: '_items' },
        _react2.default.createElement(_widgets.PriceBreakdown, { instance: instance, inputs: instance.references.service_instance_properties }),
        _react2.default.createElement(
            'p',
            { className: '_total' },
            _react2.default.createElement(
                'span',
                { className: '_label' },
                'Total:'
            ),
            _react2.default.createElement(
                'span',
                { className: '_value' },
                (0, _price.getPrice)(instance)
            )
        )
    );
}

var ServicebotManagedBilling = function (_React$Component) {
    (0, _inherits3.default)(ServicebotManagedBilling, _React$Component);

    function ServicebotManagedBilling(props) {
        (0, _classCallCheck3.default)(this, ServicebotManagedBilling);

        var _this = (0, _possibleConstructorReturn3.default)(this, (ServicebotManagedBilling.__proto__ || Object.getPrototypeOf(ServicebotManagedBilling)).call(this, props));

        _this.state = {
            instances: [],
            funds: [],
            fund_url: "api/v1/funds",
            spk: null,
            loading: true,
            cancel_modal: false,
            token: null,
            error: null,
            propEdit: false,
            currentInstance: {}
        };
        _this.getServicebotDetails = _this.getServicebotDetails.bind(_this);
        _this.requestCancellation = _this.requestCancellation.bind(_this);
        _this.handleResponse = _this.handleResponse.bind(_this);
        _this.getRequest = _this.getRequest.bind(_this);
        _this.showPropEdit = _this.showPropEdit.bind(_this);
        _this.hidePropEdit = _this.hidePropEdit.bind(_this);
        _this.changePlan = _this.changePlan.bind(_this);

        return _this;
    }

    (0, _createClass3.default)(ServicebotManagedBilling, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var self = this;
            self.getSPK();
            self.getServicebotDetails();
            self.getFundingDetails();
        }
    }, {
        key: 'handleResponse',
        value: function handleResponse(instance) {
            var _this2 = this;

            var self = this;
            return function () {
                var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(response) {
                    return _regenerator2.default.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    self.props.handleResponse && self.props.handleResponse({ event: "add_fund", response: response });

                                    if (!(instance.status === "cancelled")) {
                                        _context.next = 4;
                                        break;
                                    }

                                    _context.next = 4;
                                    return self.resubscribe(instance.id)();

                                case 4:
                                    self.getFundingDetails();
                                    self.props.setLoading(false);

                                case 6:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, _this2);
                }));

                return function (_x) {
                    return _ref.apply(this, arguments);
                };
            }();
        }
    }, {
        key: 'getFundingDetails',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var funds;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return (0, _servicebotBaseForm.Fetcher)(this.props.url + '/api/v1/funds/own', null, null, this.getRequest());

                            case 2:
                                funds = _context2.sent;

                                this.setState({ funds: funds });

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getFundingDetails() {
                return _ref2.apply(this, arguments);
            }

            return getFundingDetails;
        }()
    }, {
        key: 'getRequest',
        value: function getRequest() {
            var method = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "GET";
            var body = arguments[1];

            var headers = {
                "Content-Type": "application/json"
            };
            if (this.props.token) {
                headers["Authorization"] = "JWT " + this.props.token;
            }
            var request = { method: method,
                headers: new Headers(headers)
            };
            if (method === "POST" || method === "PUT") {
                request.body = JSON.stringify(body);
            }
            return request;
        }
    }, {
        key: 'getSubscriptionStatus',
        value: function getSubscriptionStatus() {
            var instance = this.state.instances[0];
            if (instance.status === "cancelled") {
                if (this.state.funds.length === 0 && instance.payment_plan && instance.payment_plan.amount > 0) {
                    return _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'p',
                            { className: "form-help-text" },
                            _react2.default.createElement(
                                'strong',
                                null,
                                'Status: cancelled, please update credit/debit card to reactivate'
                            )
                        )
                    );
                } else {
                    return _react2.default.createElement(
                        'div',
                        null,
                        _react2.default.createElement(
                            'p',
                            { className: "form-help-text" },
                            _react2.default.createElement(
                                'strong',
                                null,
                                'Status: cancelled'
                            )
                        )
                    );
                }
            } else {
                return _react2.default.createElement('div', null);
            }
        }
    }, {
        key: 'getServicebotDetails',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var self, instances, template;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                self = this;
                                _context3.next = 3;
                                return (0, _servicebotBaseForm.Fetcher)(self.props.url + '/api/v1/service-instances/own', "GET", null, this.getRequest("GET"));

                            case 3:
                                instances = _context3.sent;

                                if (!(!instances.error && instances.length > 0)) {
                                    _context3.next = 11;
                                    break;
                                }

                                _context3.next = 7;
                                return (0, _servicebotBaseForm.Fetcher)(self.props.url + '/api/v1/service-templates/' + instances[0].service_id + '/request', "GET", null, this.getRequest("GET"));

                            case 7:
                                template = _context3.sent;

                                self.setState({ instances: instances, template: template });
                                _context3.next = 12;
                                break;

                            case 11:
                                self.setState({ error: instances.error });

                            case 12:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getServicebotDetails() {
                return _ref3.apply(this, arguments);
            }

            return getServicebotDetails;
        }()
    }, {
        key: 'getSPK',
        value: function getSPK() {
            var self = this;
            fetch(this.props.url + '/api/v1/stripe/spk').then(function (response) {
                return response.json();
            }).then(function (json) {
                self.setState({ spk: json.spk });
            }).catch(function (e) {
                return console.error(e);
            });
        }
    }, {
        key: 'requestCancellation',
        value: function requestCancellation(id) {
            this.props.setLoading(true);

            var self = this;
            var body = {
                instance_id: id
            };
            (0, _servicebotBaseForm.Fetcher)(this.props.url + '/api/v1/service-instances/' + id + '/request-cancellation', null, null, this.getRequest("POST", body)).then(function (response) {
                if (!response.error) {
                    self.getServicebotDetails();
                    self.props.handleResponse && self.props.handleResponse({ event: "cancellation", response: response });
                    self.props.setLoading(false);
                }
            });
        }
    }, {
        key: 'getTrialStatus',
        value: function getTrialStatus() {
            var self = this;
            //Get service trial status
            if (self.state.instances.length > 0) {
                var inTrial = false;
                var trialExpires = '';
                var instance = self.state.instances[0];
                if (!instance.trial_end) {
                    return null;
                }
                var trial = new Date(instance.trial_end * 1000);
                var date_diff_indays = function date_diff_indays(date1, date2) {
                    var dt1 = new Date(date1);
                    var dt2 = new Date(date2);
                    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) / (1000 * 60 * 60 * 24));
                };
                if (instance.status === "running") {
                    var currentDate = new Date();
                    //Service is trialing if the expiration is after current date
                    if (currentDate < trial) {
                        inTrial = true;
                        trialExpires = date_diff_indays(currentDate, trial) + ' days';
                    }
                }
                if (inTrial) {
                    if (self.state.funds.length === 0) {
                        return _react2.default.createElement(
                            'div',
                            { className: 'trial-notice red' },
                            _react2.default.createElement(
                                'p',
                                { className: "form-help-text" },
                                _react2.default.createElement(
                                    'strong',
                                    null,
                                    trialExpires,
                                    ' left of the trial '
                                ),
                                ' and you have no funding source. Your subscription will be deactivated after trial expiration date. If you would like to continue your service, please update your credit/debit card below.'
                            )
                        );
                    } else {
                        return _react2.default.createElement(
                            'div',
                            { className: 'trial-notice blue' },
                            _react2.default.createElement(
                                'p',
                                { className: "form-help-text" },
                                _react2.default.createElement(
                                    'strong',
                                    null,
                                    trialExpires,
                                    ' left of the trial. '
                                ),
                                ' The initial payment will be charged once trial expires.'
                            )
                        );
                    }
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    }, {
        key: 'getBillingForm',
        value: function getBillingForm() {
            var self = this;
            var fund = self.state.funds[0];
            var buttonText = "Subscribe";
            if (fund) {
                buttonText = "Update Card";
            }
            if (self.state.instances[0].status === "cancelled") {
                buttonText = "Resubscribe";
            }
            return _react2.default.createElement(
                'div',
                null,
                self.state.funds.length === 0 || !self.state.funds[0].source ? _react2.default.createElement(
                    'div',
                    { className: 'mbf--funding-card-wrapper' },
                    _react2.default.createElement(
                        'h5',
                        { className: 'form-help-text' },
                        'Add your funding credit/debit card.'
                    ),
                    _react2.default.createElement(_billingSettingsForm.BillingForm, { buttonText: buttonText,
                        handleResponse: self.handleResponse(self.state.instances[0]),
                        token: self.props.token, spk: self.state.spk,
                        external: self.props.external,
                        submitAPI: self.props.url + '/' + self.state.fund_url })
                ) : _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(_billingSettingsForm.BillingForm, { handleResponse: self.handleResponse(self.state.instances[0]),
                        buttonText: buttonText,
                        token: self.props.token,
                        spk: self.state.spk,
                        external: self.props.external,
                        submitAPI: self.props.url + '/' + self.state.fund_url, userFund: fund })
                )
            );
        }
    }, {
        key: 'showPropEdit',
        value: function showPropEdit(instance) {
            var self = this;
            return function () {
                self.setState({ propEdit: true, currentInstance: instance });
            };
        }
    }, {
        key: 'hidePropEdit',
        value: function hidePropEdit(e) {
            this.setState({ propEdit: false });
            this.getServicebotDetails();
        }
    }, {
        key: 'changePlan',
        value: function changePlan(paymentStructure) {
            var self = this;
            return function () {
                var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(e) {
                    var headers, request, updatedInstance;
                    return _regenerator2.default.wrap(function _callee4$(_context4) {
                        while (1) {
                            switch (_context4.prev = _context4.next) {
                                case 0:
                                    headers = {
                                        "Content-Type": "application/json",
                                        'Accept': 'application/json'
                                    };

                                    if (self.props.token) {
                                        headers["Authorization"] = 'JWT ' + self.props.token;
                                    }

                                    request = {
                                        method: "POST",
                                        headers: headers
                                    };


                                    self.props.setLoading(true);
                                    // self.setState({loading: true});
                                    _context4.next = 6;
                                    return fetch(self.props.url + '/api/v1/service-instances/' + self.state.instances[0].id + '/apply-payment-structure/' + paymentStructure, request);

                                case 6:
                                    _context4.next = 8;
                                    return _context4.sent.json();

                                case 8:
                                    updatedInstance = _context4.sent;

                                    console.log(updatedInstance, "hello!");
                                    if (updatedInstance.error === "This customer has no attached payment source") {
                                        self.setState({ formError: "Credit/debit card required to switch from free tier to a paid tier" });
                                    }
                                    _context4.next = 13;
                                    return self.getServicebotDetails();

                                case 13:
                                    // self.setState({loading: false});
                                    self.props.setLoading(false);

                                case 14:
                                case 'end':
                                    return _context4.stop();
                            }
                        }
                    }, _callee4, this);
                }));

                return function (_x3) {
                    return _ref4.apply(this, arguments);
                };
            }();
        }
    }, {
        key: 'resubscribe',
        value: function resubscribe(id) {
            var _this3 = this;

            return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                var self, headers, URL, updatedInstance;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                self = _this3;

                                self.props.setLoading(true);
                                headers = {
                                    "Content-Type": "application/json",
                                    'Accept': 'application/json'
                                };

                                if (_this3.props.token) {
                                    headers["Authorization"] = 'JWT ' + _this3.props.token;
                                }

                                URL = _this3.props.url;


                                self.setState({ loading: true });
                                _context5.next = 8;
                                return fetch(URL + '/api/v1/service-instances/' + id + '/reactivate', {
                                    method: "POST",
                                    headers: headers
                                });

                            case 8:
                                _context5.next = 10;
                                return _context5.sent.json();

                            case 10:
                                updatedInstance = _context5.sent;
                                _context5.next = 13;
                                return self.getServicebotDetails();

                            case 13:
                                self.props.handleResponse && self.props.handleResponse({ event: "resubscribe", response: updatedInstance });
                                self.props.setLoading(false);

                            case 15:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, _this3);
            }));
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var self = this;
            if (this.state.error) {
                return _react2.default.createElement(
                    'p',
                    null,
                    this.state.error
                );
            }
            var buttonStyle = {
                backgroundColor: "#d32f2f",
                border: "none",
                color: "#ffffff"
            };
            var buttonStyle2 = {
                backgroundColor: "#0054d3",
                border: "none",
                color: "#ffffff"
            };

            var metricProp = self.state.template && self.state.template.references.service_template_properties.find(function (prop) {
                return prop.type === "metric";
            });

            console.log(self.state.instances);
            return _react2.default.createElement(
                'div',
                { className: 'servicebot--embeddable servicebot--manage-billing-form-wrapper custom' },
                _react2.default.createElement(
                    'div',
                    { className: 'mbf--form-wrapper' },
                    self.state.instances.length > 0 ? _react2.default.createElement(
                        'div',
                        { className: 'app-content' },
                        self.state.instances.length > 0 ? _react2.default.createElement(
                            'div',
                            { className: 'mbf--subscription-summary-wrapper' },
                            _react2.default.createElement(
                                'h3',
                                null,
                                'Subscription Summary'
                            ),
                            _react2.default.createElement(
                                'div',
                                { className: 'mbf--current-services-list' },
                                self.state.instances.map(function (service) {
                                    return _react2.default.createElement(
                                        'div',
                                        { className: 'mbf--current-services-item' },
                                        _this4.getSubscriptionStatus(),
                                        _this4.getTrialStatus(),
                                        _react2.default.createElement(_widgets.PriceBreakdown, { metricProp: metricProp, instance: service }),
                                        _react2.default.createElement(_TierChooser2.default, { key: "t-" + service.payment_structure_template_id, changePlan: self.changePlan, currentPlan: service.payment_structure_template_id, template: self.state.template }),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'mbf--current-services-item-buttons' },
                                            _react2.default.createElement(
                                                'span',
                                                null,
                                                _this4.state.formError
                                            ),
                                            (service.status === "running" || service.status === "requested" || service.status === "in_progress") && _react2.default.createElement(
                                                'button',
                                                { className: 'btn btn-default btn-rounded btn-sm m-r-5', style: buttonStyle, onClick: _this4.requestCancellation.bind(_this4, service.id) },
                                                'Cancel Service'
                                            ),
                                            service.status === "cancelled" && self.state.funds[0] && _react2.default.createElement(
                                                'button',
                                                { className: 'btn btn-default btn-rounded btn-sm m-r-5', style: buttonStyle2, onClick: self.resubscribe(service.id) },
                                                'Resubscribe'
                                            )
                                        )
                                    );
                                })
                            )
                        ) : _react2.default.createElement(
                            'div',
                            null,
                            _react2.default.createElement(
                                'p',
                                null,
                                'You currently don\'t have any subscriptions.'
                            )
                        ),
                        _react2.default.createElement(
                            'h3',
                            null,
                            'Payment Information'
                        ),
                        this.getBillingForm(),
                        _react2.default.createElement(_editPropertiesForm.ModalEditProperties, { external: this.props.external, token: this.props.token, url: this.props.url, instance: self.state.instances[0], refresh: this.hidePropEdit })
                    ) : _react2.default.createElement(
                        'div',
                        { className: 'page-loader' },
                        _react2.default.createElement(
                            'div',
                            { className: 'lds-ellipsis' },
                            _react2.default.createElement('div', null),
                            _react2.default.createElement('div', null),
                            _react2.default.createElement('div', null),
                            _react2.default.createElement('div', null)
                        ),
                        _react2.default.createElement(
                            'p',
                            { className: 'page-loader-text' },
                            'Billing Management'
                        )
                    )
                )
            );
        }
    }]);
    return ServicebotManagedBilling;
}(_react2.default.Component);

var mapDispatchToProps = function mapDispatchToProps(dispatch) {
    return {
        setLoading: function setLoading(is_loading) {
            dispatch({ type: "SET_LOADING", is_loading: is_loading });
        } };
};

ServicebotManagedBilling = (0, _reactRedux.connect)(null, mapDispatchToProps)(ServicebotManagedBilling);
exports.default = ServicebotManagedBilling;