'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ModalEditProperties = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _servicebotBaseForm = require('servicebot-base-form');

var _reduxFormValidators = require('redux-form-validators');

var _reduxForm = require('redux-form');

var _buttons = require('../utilities/buttons.js');

var _buttons2 = _interopRequireDefault(_buttons);

var _client = require('../core-input-types/client');

var _client2 = _interopRequireDefault(_client);

var _reactRedux = require('react-redux');

var _price = require('../utilities/price.js');

var _handleInputs = require('../widget-inputs/handleInputs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var selectAffectPricing = function selectAffectPricing(prop) {
    if (!prop.config || !prop.config.pricing || !prop.config.pricing.value) {
        return false;
    }
    return Object.values(prop.config.pricing.value).some(function (price) {
        return price != 0;
    });
};
var renderCustomProperty = function renderCustomProperty(props) {
    var fields = props.fields,
        formJSON = props.formJSON,
        _props$meta = props.meta,
        touched = _props$meta.touched,
        error = _props$meta.error;

    var widgets = (0, _client2.default)().reduce(function (acc, widget) {
        acc[widget.type] = widget;
        return acc;
    }, {});
    return (
        //
        _react2.default.createElement(
            'div',
            { className: 'add-on-item-widgets' },
            fields.map(function (customProperty, index) {
                var prop = fields.get(index);
                if (!prop.config || !prop.config.pricing || prop.type === "metric" || prop.type === "select" && !selectAffectPricing(prop)) {
                    return _react2.default.createElement('div', { key: 'custom-props-' + index });
                }
                var property = widgets[prop.type];
                if (prop.prompt_user) {

                    return _react2.default.createElement(
                        'div',
                        { key: 'custom-props-' + index, className: '_add-on-item-widget-wrapper _add-on-item-' + index },
                        _react2.default.createElement(_reduxForm.Field, {
                            key: index,
                            currency: props.currency,
                            name: customProperty + '.data.value',
                            type: prop.type,
                            widget: property.widget,
                            component: _servicebotBaseForm.widgetField,
                            label: prop.prop_label
                            // value={formJSON[index].data.value}
                            , formJSON: prop,
                            configValue: prop.config,
                            validate: (0, _reduxFormValidators.required)()
                        })
                    );
                } else {
                    if (prop.data && prop.data.value) {
                        return _react2.default.createElement(
                            'div',
                            { key: 'custom-props-' + index, className: '_add-on-item-widget-wrapper _add-on-item-' + index },
                            _react2.default.createElement(
                                'div',
                                { className: 'sb-form-group' },
                                prop.prop_label && prop.type !== 'hidden' && _react2.default.createElement(
                                    'label',
                                    { className: '_label-' },
                                    prop.prop_label
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: '_input-container-' },
                                    _react2.default.createElement(
                                        'p',
                                        null,
                                        prop.data.value
                                    )
                                )
                            )
                        );
                    } else {
                        return _react2.default.createElement('span', { key: 'custom-props-' + index });
                    }
                }
            })
        )
    );
};

function CustomFieldEditForm(props) {
    var handlers = (0, _client2.default)().reduce(function (acc, widget) {
        acc[widget.type] = widget.handler;
        return acc;
    }, {});
    var invalid = props.invalid,
        submitting = props.submitting,
        pristine = props.pristine;


    var properties = props.formJSON.service_instance_properties.filter(function (prop) {
        return prop.type !== "select" || selectAffectPricing(prop);
    });
    var basePrice = (0, _handleInputs.getBasePrice)(props.instance.references.service_instance_properties, handlers, props.instance.payment_plan && props.instance.payment_plan.amount || 0);
    var priceData = (0, _client.getPriceData)(basePrice, properties);
    return _react2.default.createElement(
        'form',
        null,
        priceData && priceData.adjustments && priceData.adjustments.length > 0 && _react2.default.createElement(
            'div',
            null,
            _react2.default.createElement(
                'h3',
                null,
                'Subscription Add Ons'
            ),
            _react2.default.createElement(_reduxForm.FieldArray, {
                currency: props.instance.payment_plan && props.instance.payment_plan.currency || "USD",
                name: 'service_instance_properties', component: renderCustomProperty,
                formJSON: properties }),
            _react2.default.createElement(
                'div',
                { className: 'add-on-item-update-submit' },
                _react2.default.createElement(
                    'p',
                    null,
                    _react2.default.createElement(
                        'label',
                        null,
                        'Total Cost:'
                    )
                ),
                _react2.default.createElement(
                    'p',
                    null,
                    _react2.default.createElement(_price.Price, { className: '_total-price', currency: props.instance.payment_plan && props.instance.payment_plan.currency || "USD", value: priceData.total }),
                    _react2.default.createElement(
                        'span',
                        { className: '_unit' },
                        _react2.default.createElement(
                            'span',
                            { className: '_per' },
                            '/'
                        ),
                        props.instance.payment_plan.interval
                    ),
                    _react2.default.createElement(
                        'button',
                        { disabled: invalid || submitting || pristine, className: 'buttons _primary', onClick: props.handleSubmit, type: 'submit', value: 'submit' },
                        'Submit'
                    )
                )
            )
        )
    );
}
function mapStateToProps(state) {
    return {
        formJSON: (0, _reduxForm.getFormValues)("edit_properties_form")(state)
    };
}

CustomFieldEditForm = (0, _reactRedux.connect)(mapStateToProps)(CustomFieldEditForm);

function ModalEditProperties(props) {
    var url = props.url,
        token = props.token,
        show = props.show,
        refresh = props.refresh,
        instance = props.instance,
        handleSuccessResponse = props.handleSuccessResponse,
        handleFailureResponse = props.handleFailureResponse,
        external = props.external;

    var submissionRequest = {
        'method': 'POST',
        'url': url + '/api/v1/service-instances/' + instance.id + '/change-properties'
    };

    return _react2.default.createElement(
        'div',
        { className: 'servicebot-subscription-add-ons' },
        _react2.default.createElement(_servicebotBaseForm.ServicebotBaseForm, {
            form: CustomFieldEditForm
            //todo: is there a way to not need initial values to reference a prop name? (for array of X cases)
            , initialValues: { "service_instance_properties": instance.references.service_instance_properties },
            submissionRequest: submissionRequest,
            successMessage: "Properties edited successfully",
            handleResponse: refresh
            // handleFailure={handleFailureResponse}
            , formName: "edit_properties_form",
            formProps: { instance: instance },
            token: token,
            external: external,
            reShowForm: true

        })
    );
}

exports.ModalEditProperties = ModalEditProperties;