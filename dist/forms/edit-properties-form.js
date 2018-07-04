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
                if (!formJSON[index].config || !formJSON[index].config.pricing || formJSON[index].type === "metric") {
                    return _react2.default.createElement('div', null);
                }
                var property = widgets[formJSON[index].type];
                if (formJSON[index].prompt_user) {

                    return _react2.default.createElement(
                        'div',
                        { className: '_add-on-item-widget-wrapper _add-on-item-' + index },
                        _react2.default.createElement(_reduxForm.Field, {
                            key: index,
                            name: customProperty + '.data.value',
                            type: formJSON[index].type,
                            widget: property.widget,
                            component: _servicebotBaseForm.widgetField,
                            label: formJSON[index].prop_label
                            // value={formJSON[index].data.value}
                            , formJSON: formJSON[index],
                            configValue: formJSON[index].config,
                            validate: (0, _reduxFormValidators.required)()
                        })
                    );
                } else {
                    if (formJSON[index].data && formJSON[index].data.value) {
                        return _react2.default.createElement(
                            'div',
                            { className: '_add-on-item-widget-wrapper _add-on-item-' + index },
                            _react2.default.createElement(
                                'div',
                                { className: 'form-group form-group-flex' },
                                formJSON[index].prop_label && formJSON[index].type !== 'hidden' && _react2.default.createElement(
                                    'label',
                                    { className: 'control-label form-label-flex-md' },
                                    formJSON[index].prop_label
                                ),
                                _react2.default.createElement(
                                    'div',
                                    { className: 'form-input-flex' },
                                    _react2.default.createElement(
                                        'p',
                                        null,
                                        formJSON[index].data.value
                                    )
                                )
                            )
                        );
                    } else {
                        return _react2.default.createElement('span', null);
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
        submitting = props.submitting;


    var properties = props.formJSON.service_instance_properties;
    var basePrice = (0, _handleInputs.getBasePrice)(props.instance.references.service_instance_properties, handlers, props.instance.payment_plan.amount);
    var priceData = (0, _client.getPriceData)(basePrice, properties);
    console.log(invalid, submitting, "hu");
    return _react2.default.createElement(
        'form',
        null,
        _react2.default.createElement(_reduxForm.FieldArray, { name: 'service_instance_properties', component: renderCustomProperty,
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
                _react2.default.createElement(_price.Price, { className: '_total-price', value: priceData.total }),
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
                    { disabled: invalid || submitting, className: 'buttons _primary', onClick: props.handleSubmit, type: 'submit', value: 'submit' },
                    'Submit'
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
        { className: 'p-20' },
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