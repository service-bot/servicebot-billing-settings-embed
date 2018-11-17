import React from "react";
import {Field, FormSection} from "redux-form";
import {inputField, selectField, priceField} from "servicebot-base-form";
import getWidgets from "../core-input-types/client"
import {getPrice, Price} from "./price";
import {getBasePrice} from "../widget-inputs/handleInputs";
const values = require('object.values');
if (!Object.values) {
    values.shim();
}
let PriceOperation = (props) => {
    let {input} = props;
    return (
        <select {...input}>
            <option value="add">Add</option>
            <option value="subtract">Subtract</option>
            <option value="divide">Percent Decrease</option>
            <option value="multiply">Percent Increase</option>
        </select>
    )
};

let RenderWidget = (props) => {
    const {showPrice, member, widgetType, configValue, defaultWidgetValue} = props;

    const widget = getWidgets().find(widgetToCheck => widgetToCheck.type === widgetType);
    if (!widget) {
        console.error("widget does not exist ", widgetType);
    }
    return (
        <div>
            <FormSection name={`${member}.config`}>
                {widget.config && <Field name={`value`} component={widget.config}/>}
                {widget.pricing && showPrice &&
                <div className="addon-widget-has-pricing">
                    <FormSection name={`pricing`}>

                    <Field name="operation" component={selectField} label="Apply Price Change"
                           options={[
                               {id: "add", name: "Add to base price"},
                               {id: "subtract", name: "Subtract from base price"},
                               {id: "multiply", name: "Percent add to base price"},
                               {id: "divide", name: "Percent off from base price"},
                           ]}/>

                        <div className="addon-widget-pricing-inputs-wrapper">
                            <label className="_label- addon-widget-pricing-input-label">Add-On Pricing</label>
                            <Field name={`value`} configValue={configValue} component={widget.pricing}/>
                        </div>
                    </FormSection>
                </div>}
            </FormSection>
            {widget.widget &&
            <Field name={`${member}.data.value`} configValue={configValue} component={widget.widget}/>}
        </div>
    );
};


let PriceBreakdown = (props) => {
    const {metricProp, instance,tier} = props;
    let inputs = instance.references.service_instance_properties;
    let widgets = getWidgets().reduce((acc, widget) => {
        acc[widget.type] = widget;
        return acc;
    }, {});

    let handlers = getWidgets().reduce((acc, widget) => {
        acc[widget.type] = widget.handler;
        return acc;

    }, {});
    let metricTier = metricProp && tier && metricProp.config.pricing && metricProp.config.pricing.tiers && metricProp.config.pricing.tiers && metricProp.config.pricing.tiers.includes(tier.name);
    let map = {
        add: "+",
        subtract: "-",
        "multiply" : "+",
        "divide": "-"
    };
    // console.log(metricProp, instance);
    let basePrice = getBasePrice(instance.references.service_instance_properties, handlers, instance.payment_plan.amount);
    let breakdown = inputs.reduce((acc, input) => {
        if (input.config && input.config.pricing && widgets[input.type] && widgets[input.type].handler && widgets[input.type].handler.priceHandler && widgets[input.type].handler.priceHandler(input.data, input.config)) {
            let price = widgets[input.type].handler.priceHandler(input.data, input.config)

            acc.push(
                <p key={`item-${input.id}`} className="_item">
                    <span className="_label">{input.prop_label}</span>
                    <span className="_value_wrap">
                        <span className="_prefix">{map[input.config.pricing.operation]}</span>
                        <span className="_value"><Price value={price} currency={instance.payment_plan.currency}/></span>
                    </span>
                </p>);
        }
        return acc;
    }, [(                <p key={`item-${instance.payment_plan.id}`} className="_item">
        <span className="_label">Base price</span>
        <span className="_value_wrap">
                        <span className="_prefix">+</span>
                        <span className="_value"><Price value={basePrice} currency={instance.payment_plan.currency}/></span>
                    </span>
    </p>)]);
    if(breakdown.length === 1){
        return <div className={`servicebot-subscription-summary`}>
            <div className="mbf-summary">
                {metricTier && <span className="_metric">{metricProp.data.value} {metricProp.config.unit}</span>}
                <p className="_total"><span className="_label">Total</span><span className="_value">{getPrice(instance)}</span></p>
            </div>
        </div>
    }
    if (breakdown.length > 1) {
        return <div>
            <div className="mbf-summary">
                <p className="_heading">Items</p>

                {metricTier && <span className="_metric">{metricProp.data.value} {metricProp.config.unit} </span>}
                <div className={`_items`}>
                    {breakdown}
                </div>
                <p className="_total"><span className="_label">Total</span><span className="_value">{getPrice(instance)}</span></p>

            </div>
        </div>
    }else{
        //todo: show total price?
        return <div></div>
    }
};
let WidgetList = props => (
    <Field name={props.name} id={props.name} component={selectField}
           options={getWidgets()} valueKey="type" labelKey="label"
    />
);

export {RenderWidget, WidgetList, PriceBreakdown}