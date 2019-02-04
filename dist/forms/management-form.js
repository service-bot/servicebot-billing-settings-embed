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

var _load = require('../utilities/load.js');

var _load2 = _interopRequireDefault(_load);

var _Invoices = require('../Invoices');

var _Invoices2 = _interopRequireDefault(_Invoices);

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
            self.getInvoices();
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

                                    if (!(instance.status === "cancelled" && self.state.instances.length === 1)) {
                                        _context.next = 6;
                                        break;
                                    }

                                    _context.next = 4;
                                    return self.resubscribe(instance.id)();

                                case 4:
                                    _context.next = 7;
                                    break;

                                case 6:
                                    if (self.state.formError || self.state.resubscribeError) {
                                        self.setState({ formError: null, resubscribeError: null });
                                    }

                                case 7:
                                    self.getFundingDetails();
                                    self.props.setLoading(false);

                                case 9:
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
        key: 'getInvoices',
        value: function () {
            var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                var invoices;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return (0, _servicebotBaseForm.Fetcher)(this.props.url + '/api/v1/invoices/own', null, null, this.getRequest());

                            case 2:
                                invoices = _context2.sent;

                                this.setState({ invoices: invoices });

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getInvoices() {
                return _ref2.apply(this, arguments);
            }

            return getInvoices;
        }()
    }, {
        key: 'getFundingDetails',
        value: function () {
            var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                var funds;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return (0, _servicebotBaseForm.Fetcher)(this.props.url + '/api/v1/funds/own', null, null, this.getRequest());

                            case 2:
                                funds = _context3.sent;

                                this.setState({ funds: funds });

                            case 4:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getFundingDetails() {
                return _ref3.apply(this, arguments);
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
        value: function getSubscriptionStatus(instance) {
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
            } else if (instance.status === "cancellation_pending") {
                return _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(
                        'p',
                        { className: "form-help-text" },
                        _react2.default.createElement(
                            'strong',
                            null,
                            'Status: Subscription will not renew after this billing cycle'
                        )
                    )
                );
            } else {
                return _react2.default.createElement('div', null);
            }
        }
    }, {
        key: 'getServicebotDetails',
        value: function () {
            var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                var self, url, instances, templates, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, instance;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                self = this;
                                url = this.props.serviceInstanceId ? self.props.url + '/api/v1/service-instances/' + this.props.serviceInstanceId : self.props.url + '/api/v1/service-instances/own';
                                _context4.next = 4;
                                return (0, _servicebotBaseForm.Fetcher)(url, "GET", null, this.getRequest("GET"));

                            case 4:
                                instances = _context4.sent;

                                if (this.props.serviceInstanceId) {
                                    instances = [instances];
                                }

                                if (!(!instances.error && instances.length > 0)) {
                                    _context4.next = 39;
                                    break;
                                }

                                templates = {};
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context4.prev = 11;
                                _iterator = instances[Symbol.iterator]();

                            case 13:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context4.next = 22;
                                    break;
                                }

                                instance = _step.value;

                                if (templates[instance.service_id]) {
                                    _context4.next = 19;
                                    break;
                                }

                                _context4.next = 18;
                                return (0, _servicebotBaseForm.Fetcher)(self.props.url + '/api/v1/service-templates/' + instance.service_id + '/request', "GET", null, this.getRequest("GET"));

                            case 18:
                                templates[instance.service_id] = _context4.sent;

                            case 19:
                                _iteratorNormalCompletion = true;
                                _context4.next = 13;
                                break;

                            case 22:
                                _context4.next = 28;
                                break;

                            case 24:
                                _context4.prev = 24;
                                _context4.t0 = _context4['catch'](11);
                                _didIteratorError = true;
                                _iteratorError = _context4.t0;

                            case 28:
                                _context4.prev = 28;
                                _context4.prev = 29;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 31:
                                _context4.prev = 31;

                                if (!_didIteratorError) {
                                    _context4.next = 34;
                                    break;
                                }

                                throw _iteratorError;

                            case 34:
                                return _context4.finish(31);

                            case 35:
                                return _context4.finish(28);

                            case 36:
                                self.setState({ instances: instances, templates: templates });
                                _context4.next = 40;
                                break;

                            case 39:
                                if (instances.length === 0) {
                                    self.setState({ error: "You do not have any subscriptions" });
                                    if (self.props.handleResponse) {

                                        self.props.handleResponse({ error: "No subscriptions" });
                                    }
                                } else if (instances.error) {
                                    self.setState({ error: instances.error });
                                    if (self.props.handleResponse) {
                                        self.props.handleResponse({ error: instances.error });
                                    }
                                } else {
                                    self.setState({ error: "Error gathering billing information" });
                                    if (self.props.handleResponse) {

                                        self.props.handleResponse({ error: "Error" });
                                    }
                                }

                            case 40:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this, [[11, 24, 28, 36], [29,, 31, 35]]);
            }));

            function getServicebotDetails() {
                return _ref4.apply(this, arguments);
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
        value: function getTrialStatus(instance) {
            var self = this;
            //Get service trial status
            if (instance) {
                var inTrial = false;
                var trialExpires = '';
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
                            { className: 'sb-trial-notice' },
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
                            { className: 'sb-trial-notice' },
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
        value: function getBillingForm(instance) {
            var self = this;
            var fund = self.state.funds[0];
            var buttonText = "Subscribe";
            if (fund) {
                buttonText = "Update Card";
            }
            if (instance.status === "cancelled" && self.state.instances.length === 1) {
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
                        handleResponse: self.handleResponse(instance),
                        token: self.props.token, spk: self.state.spk,
                        external: self.props.external,
                        submitAPI: self.props.url + '/' + self.state.fund_url })
                ) : _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(_billingSettingsForm.BillingForm, { handleResponse: self.handleResponse(instance),
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
                var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(e) {
                    var headers, request, updatedInstance;
                    return _regenerator2.default.wrap(function _callee5$(_context5) {
                        while (1) {
                            switch (_context5.prev = _context5.next) {
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
                                    _context5.next = 6;
                                    return fetch(self.props.url + '/api/v1/service-instances/' + self.state.instances[0].id + '/apply-payment-structure/' + paymentStructure, request);

                                case 6:
                                    _context5.next = 8;
                                    return _context5.sent.json();

                                case 8:
                                    updatedInstance = _context5.sent;

                                    if (updatedInstance.error === "This customer has no attached payment source") {
                                        self.setState({ formError: "Credit/debit card required to switch from free tier to a paid tier" });
                                    } else if (updatedInstance.error) {
                                        self.setState({ formError: updatedInstance.error });
                                    }
                                    if (!updatedInstance.error && self.state.formError) {
                                        self.setState({ formError: null });
                                    }
                                    _context5.next = 13;
                                    return self.getServicebotDetails();

                                case 13:
                                    if (self.props.handleResponse) {
                                        self.props.handleResponse({ event: "change_plan", response: self.state.instances[0] });
                                    }
                                    // self.setState({loading: false});
                                    self.props.setLoading(false);

                                case 15:
                                case 'end':
                                    return _context5.stop();
                            }
                        }
                    }, _callee5, this);
                }));

                return function (_x3) {
                    return _ref5.apply(this, arguments);
                };
            }();
        }
    }, {
        key: 'resubscribe',
        value: function resubscribe(id) {
            var _this3 = this;

            return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
                var self, headers, URL, updatedInstance;
                return _regenerator2.default.wrap(function _callee6$(_context6) {
                    while (1) {
                        switch (_context6.prev = _context6.next) {
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
                                _context6.next = 8;
                                return fetch(URL + '/api/v1/service-instances/' + id + '/reactivate', {
                                    method: "POST",
                                    headers: headers
                                });

                            case 8:
                                _context6.next = 10;
                                return _context6.sent.json();

                            case 10:
                                updatedInstance = _context6.sent;

                                if (updatedInstance.error) {
                                    self.setState({ resubscribeError: updatedInstance.error });
                                } else if (self.state.resubscribeError || self.state.formError) {
                                    self.setState({ resubscribeError: null, formError: null });
                                }
                                _context6.next = 14;
                                return self.getServicebotDetails();

                            case 14:
                                self.props.handleResponse && self.props.handleResponse({ event: "resubscribe", response: updatedInstance });
                                self.props.setLoading(false);

                            case 16:
                            case 'end':
                                return _context6.stop();
                        }
                    }
                }, _callee6, _this3);
            }));
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var self = this;
            if (this.state.error) {
                return _react2.default.createElement(
                    'div',
                    { className: 'servicebot--embeddable servicebot--manage-billing-form-wrapper custom' },
                    _react2.default.createElement(
                        'div',
                        { className: 'mbf--form-wrapper' },
                        _react2.default.createElement(
                            'div',
                            { className: 'app-content' },
                            _react2.default.createElement(
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
                                    _react2.default.createElement(
                                        'p',
                                        null,
                                        this.state.error
                                    )
                                )
                            )
                        )
                    )
                );
            }

            // let metricProp = self.state.template && self.state.template.references.service_template_properties.find(prop => prop.type === "metric");

            return _react2.default.createElement(
                'div',
                { className: 'servicebot--embeddable servicebot--manage-billing-form-wrapper custom' },
                _react2.default.createElement(_load2.default, { className: 'servicebot-embed-custom-loader', finishLoading: this.props.finishLoading }),
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
                                    var template = self.state.templates[service.service_id];
                                    var tier = service.references.payment_structure_templates[0] && template.references.tiers.find(function (tier) {
                                        return tier.id === service.references.payment_structure_templates[0].tier_id;
                                    });

                                    var metricProp = service.references.service_instance_properties.find(function (prop) {
                                        return prop.type === "metric";
                                    });
                                    return _react2.default.createElement(
                                        'div',
                                        { key: 'service-list-' + service.service_id, className: 'mbf--current-services-item' },
                                        _this4.getSubscriptionStatus(service),
                                        _this4.getTrialStatus(service),
                                        _react2.default.createElement(_widgets.PriceBreakdown, { tier: tier, metricProp: metricProp, instance: service }),
                                        _this4.state.formError && _react2.default.createElement(
                                            'h3',
                                            { style: { color: "red" } },
                                            _this4.state.formError
                                        ),
                                        _react2.default.createElement(_TierChooser2.default, { key: "t-" + service.payment_structure_template_id, changePlan: self.changePlan, currentPlan: service.payment_structure_template_id, template: template }),
                                        _react2.default.createElement(
                                            'div',
                                            { className: 'mbf--current-services-item-buttons' },
                                            _this4.state.resubscribeError && _react2.default.createElement(
                                                'span',
                                                { style: { color: "red" } },
                                                _this4.state.resubscribeError
                                            ),
                                            (service.status === "running" || service.status === "requested" || service.status === "in_progress") && _react2.default.createElement(
                                                'button',
                                                { className: 'buttons _right _rounded mbf--btn-cancel-service',
                                                    onClick: _this4.requestCancellation.bind(_this4, service.id) },
                                                'Cancel Service'
                                            ),
                                            (service.status === "cancelled" || service.status === "cancellation_pending") && self.state.funds[0] && _react2.default.createElement(
                                                'button',
                                                { className: 'buttons _right _rounded mbf--btn-resubscribe-service',
                                                    onClick: self.resubscribe(service.id) },
                                                'Resubscribe'
                                            ),
                                            _react2.default.createElement('div', { className: 'clear' })
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
                        this.getBillingForm(self.state.instances[0]),
                        _react2.default.createElement(_editPropertiesForm.ModalEditProperties, { external: this.props.external, token: this.props.token, url: this.props.url, instance: self.state.instances[0], refresh: this.hidePropEdit }),
                        self.state.instances[0] && _react2.default.createElement(_Invoices2.default, { user: self.state.instances[0].references.users[0], invoices: this.state.invoices })
                    ) : _react2.default.createElement(
                        _load2.default,
                        { finishLoading: this.props.finishLoading },
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
module.exports = exports.default;