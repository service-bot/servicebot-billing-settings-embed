import React from 'react';
import {ServicebotBaseForm, widgetField} from "servicebot-base-form";
import {required, url} from 'redux-form-validators'
import {Field, FieldArray, getFormValues} from 'redux-form'
import Buttons from "../utilities/buttons.js";
import getWidgets from "../core-input-types/client";
import {getPriceData} from "../core-input-types/client";
import {connect} from "react-redux";
import {Price} from '../utilities/price.js';
import {getBasePrice} from "../widget-inputs/handleInputs";


let renderCustomProperty = (props) => {
    const {fields, formJSON, meta: {touched, error}} = props;
    let widgets = getWidgets().reduce((acc, widget) => {
        acc[widget.type] = widget;
        return acc;
    }, {});
    return (
       //
        <div className="add-on-item-widgets">
            {fields.map((customProperty, index) => {
                    if(!formJSON[index].config.pricing){
                        return <div/>
                    }
                    let property = widgets[formJSON[index].type];
                    if(formJSON[index].prompt_user){

                        return (
                            <div className={`_add-on-item-widget-wrapper _add-on-item-${index}`}>
                                <Field
                                    key={index}
                                    name={`${customProperty}.data.value`}
                                    type={formJSON[index].type}
                                    widget={property.widget}
                                    component={widgetField}
                                    label={formJSON[index].prop_label}
                                    // value={formJSON[index].data.value}
                                    formJSON={formJSON[index]}
                                    configValue={formJSON[index].config}
                                    validate={required()}
                                />
                            </div>
                        );
                    }else{
                        if(formJSON[index].data && formJSON[index].data.value){
                            return (
                                <div className={`_add-on-item-widget-wrapper _add-on-item-${index}`}>
                                    <div className={`form-group form-group-flex`}>
                                        {(formJSON[index].prop_label && formJSON[index].type !== 'hidden') &&
                                        <label className="control-label form-label-flex-md">{formJSON[index].prop_label}</label>}
                                        <div className="form-input-flex">
                                            <p>{formJSON[index].data.value}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }else{
                            return (
                                <span/>
                            );
                        }


                    }

                }
            )}
        </div>
    )
};





function CustomFieldEditForm(props) {
    let handlers = getWidgets().reduce((acc, widget) => {
        acc[widget.type] = widget.handler;
        return acc;

    }, {});


    let properties = props.formJSON.service_instance_properties;
    let basePrice = getBasePrice(props.instance.references.service_instance_properties, handlers, props.instance.payment_plan.amount);
    let priceData = getPriceData(basePrice, properties);
    return (
        <form>
            <FieldArray name="service_instance_properties" component={renderCustomProperty}
                        formJSON={properties}/>

            <div className="add-on-item-update-submit">
                <p>Total Price: <Price value={priceData.total} /> / {props.instance.payment_plan.interval}</p>
                <button className="buttons _primary" onClick={props.handleSubmit} type="submit" value="submit">Submit</button>
            </div>
        </form>
    )
}
function mapStateToProps(state) {
    return {
        formJSON: getFormValues("edit_properties_form")(state)
    }
}


CustomFieldEditForm = connect(mapStateToProps)(CustomFieldEditForm);


function ModalEditProperties(props){
    let {url, token, show, hide, instance, handleSuccessResponse, handleFailureResponse} = props;
    let submissionRequest = {
        'method': 'POST',
        'url': `${url}/api/v1/service-instances/${instance.id}/change-properties`
    };



    return (
            <div className="p-20">
                <ServicebotBaseForm
                    form={CustomFieldEditForm}
                    //todo: is there a way to not need initial values to reference a prop name? (for array of X cases)
                    initialValues={{"service_instance_properties" : instance.references.service_instance_properties}}
                    submissionRequest={submissionRequest}
                    successMessage={"Properties edited successfully"}
                    handleResponse={hide}
                    // handleFailure={handleFailureResponse}
                    formName={"edit_properties_form"}
                    formProps={{instance}}
                    token={token}

                />
            </div>
    )

}


export {ModalEditProperties}