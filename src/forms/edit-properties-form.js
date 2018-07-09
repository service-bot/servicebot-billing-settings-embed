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



let selectAffectPricing = function(prop){
    if(!prop.config || !prop.config.pricing || !prop.config.pricing.value){
        return false;
    }
    return Object.values(prop.config.pricing.value).some(price => price != 0)
}
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
                let prop = fields.get(index);
                    if(!prop.config || !prop.config.pricing || prop.type === "metric" || (prop.type === "select" && !selectAffectPricing(prop))){
                        return <div/>
                    }
                    let property = widgets[prop.type];
                    if(prop.prompt_user){

                        return (
                            <div className={`_add-on-item-widget-wrapper _add-on-item-${index}`}>
                                <Field
                                    key={index}
                                    name={`${customProperty}.data.value`}
                                    type={prop.type}
                                    widget={property.widget}
                                    component={widgetField}
                                    label={prop.prop_label}
                                    // value={formJSON[index].data.value}
                                    formJSON={prop}
                                    configValue={prop.config}
                                    validate={required()}
                                />
                            </div>
                        );
                    }else{
                        if(prop.data && prop.data.value){
                            return (
                                <div className={`_add-on-item-widget-wrapper _add-on-item-${index}`}>
                                    <div className={`form-group form-group-flex`}>
                                        {(prop.prop_label && prop.type !== 'hidden') &&
                                        <label className="control-label form-label-flex-md">{prop.prop_label}</label>}
                                        <div className="form-input-flex">
                                            <p>{prop.data.value}</p>
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
    let {invalid, submitting} = props;

    let properties = props.formJSON.service_instance_properties.filter(prop => {
        return prop.type !== "select" || selectAffectPricing(prop)
    });
    let basePrice = getBasePrice(props.instance.references.service_instance_properties, handlers, props.instance.payment_plan.amount);
    let priceData = getPriceData(basePrice, properties);
    console.log(invalid, submitting, "hu")
    return (
        <form>
            {priceData.length > 0 && <div>
            <h3>Subscription Add Ons</h3>

            <FieldArray name="service_instance_properties" component={renderCustomProperty}
                        formJSON={properties}/>

            <div className="add-on-item-update-submit">
                <p>
                    <label>Total Cost:</label>
                </p>
               <p>
                    <Price className="_total-price" value={priceData.total} />
                    <span className="_unit"><span className="_per">/</span>{props.instance.payment_plan.interval}</span>
                    <button disabled={invalid|| submitting} className="buttons _primary" onClick={props.handleSubmit} type="submit" value="submit">Submit</button>
                </p>
            </div>
            </div>}
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
    let {url, token, show, refresh, instance, handleSuccessResponse, handleFailureResponse, external} = props;
    let submissionRequest = {
        'method': 'POST',
        'url': `${url}/api/v1/service-instances/${instance.id}/change-properties`
    };



    return (
            <div>
                <ServicebotBaseForm
                    form={CustomFieldEditForm}
                    //todo: is there a way to not need initial values to reference a prop name? (for array of X cases)
                    initialValues={{"service_instance_properties" : instance.references.service_instance_properties}}
                    submissionRequest={submissionRequest}
                    successMessage={"Properties edited successfully"}
                    handleResponse={refresh}
                    // handleFailure={handleFailureResponse}
                    formName={"edit_properties_form"}
                    formProps={{instance}}
                    token={token}
                    external={external}
                    reShowForm={true}

                />
            </div>
    )

}


export {ModalEditProperties}