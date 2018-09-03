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

var _currencySymbolMap = require('currency-symbol-map');

var _currencySymbolMap2 = _interopRequireDefault(_currencySymbolMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ = require('lodash');

var numberWithCommas = function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

var Tier = function Tier(props) {
    var currentPlan = props.currentPlan,
        tier = props.tier,
        plan = props.plan,
        pickTier = props.pickTier,
        isCurrent = props.isCurrent,
        isSelected = props.isSelected;

    var tierContent = void 0,
        tierButton = void 0;
    var currency = (0, _currencySymbolMap2.default)(plan.currency);
    var tierPrice = numberWithCommas(plan.amount / 100);
    if (plan.trial_period_days > 0) {
        tierButton = "Try for Free";
    } else {
        tierButton = "Get Started";
    }
    if (plan.type === "subscription") {
        if (tier.unit) {
            tierContent = _react2.default.createElement(
                'span',
                null,
                currency,
                tierPrice,
                _react2.default.createElement(
                    'span',
                    { className: '_interval-name' },
                    '/',
                    plan.interval
                ),
                _react2.default.createElement(
                    'span',
                    { className: '_metered-unit' },
                    'per ',
                    tier.unit
                )
            );
        } else {
            tierContent = _react2.default.createElement(
                'span',
                null,
                currency,
                tierPrice,
                _react2.default.createElement(
                    'span',
                    { className: '_interval-name' },
                    '/',
                    plan.interval
                )
            );
        }
        if (plan.amount == 0) {
            tierContent = "Free";
        }
    }
    if (plan.type === "one_time") {
        if (plan.amount == 0) {
            tierContent = "Free";
        } else {
            tierContent = '' + currency + tierPrice;
        }
    }
    if (plan.type === "custom") {
        tierContent = "Contact";
        tierButton = "Contact Sales";
    }
    tierButton = "Change Plan";
    return _react2.default.createElement(
        'div',
        { className: '_tier ' + (isCurrent ? '_current' : '') + ' ' + (isSelected ? '_selected' : '') },
        _react2.default.createElement(
            'h2',
            { className: '_name' },
            tier.name
        ),
        _react2.default.createElement(
            'span',
            { className: '_price' },
            tierContent
        ),
        isCurrent && _react2.default.createElement(
            'button',
            { className: '_selected-label buttons rounded', disabled: true },
            'Current Plan'
        ),
        !isSelected && !isCurrent && _react2.default.createElement(
            'button',
            { onClick: pickTier(plan.id), className: '_select-tier buttons rounded' },
            tierButton
        ),
        _react2.default.createElement(
            'div',
            { className: '_tier-confirm-wrapper' },
            isSelected && !isCurrent && _react2.default.createElement(
                'button',
                { onClick: props.changePlan, className: '_confirm-tier buttons rounded', 'aria-label': 'confirm change plan' },
                _react2.default.createElement('span', { className: 'icon check' })
            ),
            isSelected && !isCurrent && _react2.default.createElement(
                'button',
                { onClick: pickTier(currentPlan), className: '_confirm-tier _cancel-tier buttons rounded', 'aria-label': 'cancel change plan' },
                _react2.default.createElement('span', { className: 'icon close' })
            )
        ),
        _react2.default.createElement(
            'ul',
            { className: '_feature-list' },
            tier.features.map(function (feature) {
                return _react2.default.createElement(
                    'li',
                    { className: '_item' },
                    feature
                );
            })
        )
    );
};

var IntervalPicker = function IntervalPicker(props) {

    return _react2.default.createElement(
        'ul',
        { className: '_selector' },
        props.intervals.sort(function (a, b) {
            if (a === "year" || b === "one_time") {
                return 1;
            }
            if (a === "one_time" || b === "year") {
                return -1;
            }
            if (a === "month") {
                return 1;
            }
            if (b === "month") {
                return -1;
            }
            if (a === "week") {
                return 1;
            }
            if (a === "day") {
                return -1;
            }
        }).map(function (interval) {
            var intervalClass = "_interval";
            if (props.currentInterval === interval) {
                intervalClass += " _selected";
            }
            var intervalNames = {
                "one_time": "One Time",
                "month": "Monthly",
                "year": "Annually",
                "day": "Daily",
                "week": "Weekly"
            };

            return _react2.default.createElement(
                'li',
                { className: intervalClass, onClick: props.changeInterval(interval) },
                intervalNames[interval]
            );
        })
    );
};

var TierSelector = function (_React$Component) {
    (0, _inherits3.default)(TierSelector, _React$Component);

    function TierSelector(props) {
        (0, _classCallCheck3.default)(this, TierSelector);

        var _this = (0, _possibleConstructorReturn3.default)(this, (TierSelector.__proto__ || Object.getPrototypeOf(TierSelector)).call(this, props));

        _this.state = {
            tiers: [],
            paymentPlans: {},
            currentInterval: null,
            currentPlan: props.currentPlan,
            selectedPlan: props.currentPlan
        };
        _this.changeInterval = _this.changeInterval.bind(_this);
        _this.pickTier = _this.pickTier.bind(_this);

        return _this;
    }

    (0, _createClass3.default)(TierSelector, [{
        key: 'pickTier',
        value: function pickTier(paymentPlan) {
            var self = this;
            return function (e) {
                self.setState({ selectedPlan: paymentPlan });
            };
        }
    }, {
        key: 'componentDidMount',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var _props, template, currentPlan, metricProp, tiers, currentInterval, paymentPlans;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _props = this.props, template = _props.template, currentPlan = _props.currentPlan;
                                metricProp = template.references.service_template_properties.find(function (prop) {
                                    return prop.type === "metric";
                                });
                                tiers = template.references.tiers;

                                if (metricProp) {
                                    tiers = template.references.tiers.map(function (tier) {
                                        if (metricProp.config.pricing.tiers.includes(tier.name)) {
                                            tier.unit = metricProp.config.unit;
                                        }
                                        return tier;
                                    });
                                }
                                currentInterval = null;
                                paymentPlans = tiers.reduce(function (acc, tier) {
                                    return acc.concat(tier.references.payment_structure_templates);
                                }, []).reduce(function (acc, plan) {
                                    if (plan.id == currentPlan) {
                                        currentInterval = plan.interval;
                                    }
                                    acc[plan.type] = [plan].concat(acc[plan.type] || []);
                                    return acc;
                                }, {});

                                this.setState({ tiers: tiers, paymentPlans: paymentPlans, currentInterval: currentInterval });

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function componentDidMount() {
                return _ref.apply(this, arguments);
            }

            return componentDidMount;
        }()
    }, {
        key: 'changeInterval',
        value: function changeInterval(currentInterval) {
            var self = this;
            return function (e) {
                self.setState({ currentInterval: currentInterval });
            };
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                tiers = _state.tiers,
                currentInterval = _state.currentInterval,
                currentPlan = _state.currentPlan,
                selectedPlan = _state.selectedPlan,
                _state$paymentPlans = _state.paymentPlans,
                subscription = _state$paymentPlans.subscription,
                custom = _state$paymentPlans.custom,
                one_time = _state$paymentPlans.one_time;

            var currentPlans = custom || [];
            var intervals = new Set([]);
            var self = this;
            var checkoutConfig = {};
            if (one_time) {
                intervals.add("one_time");
            }
            if (subscription) {
                subscription.forEach(function (sub) {
                    intervals.add(sub.interval);
                });
            }
            var intervalArray = Array.from(intervals);
            if (subscription && currentInterval !== "one_time") {
                subscription = subscription.sort(function (a, b) {
                    return b.amount - a.amount;
                }).reduce(function (acc, sub) {
                    acc[sub.interval] = [sub].concat(acc[sub.interval] || []);
                    return acc;
                }, {});
                currentPlans = subscription[currentInterval || intervalArray[0]].concat(currentPlans);
            }
            if (currentInterval === "one_time") {
                one_time.sort(function (a, b) {
                    return b.amount - a.amount;
                });
                currentPlans = one_time.concat(currentPlans);
            }

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'servicebot-billing-type-selector' },
                    currentInterval && currentInterval !== "custom" && _react2.default.createElement(IntervalPicker, { changeInterval: this.changeInterval, currentInterval: currentInterval, intervals: intervalArray })
                ),
                currentInterval !== "custom" && _react2.default.createElement(
                    'div',
                    { className: 'servicebot-pricing-table' },
                    _.sortBy(currentPlans, ['amount', 'id']).map(function (plan) {
                        if (plan.type === "custom") {
                            return _react2.default.createElement('div', null);
                        }
                        var props = {
                            pickTier: self.pickTier,
                            key: plan.id,
                            tier: tiers.find(function (tier) {
                                return tier.id === plan.tier_id;
                            }),
                            plan: plan,
                            currentPlan: currentPlan,
                            changePlan: self.props.changePlan(plan.id)
                        };

                        if (plan.id === currentPlan) {
                            props.isCurrent = true;
                        }
                        if (plan.id === selectedPlan) {
                            props.isSelected = true;
                        }
                        return _react2.default.createElement(Tier, props);
                    })
                ),
                currentInterval === "custom" && _react2.default.createElement(
                    'p',
                    null,
                    'Enterprise Plan'
                )
            );
        }
    }]);
    return TierSelector;
}(_react2.default.Component);

exports.default = TierSelector;