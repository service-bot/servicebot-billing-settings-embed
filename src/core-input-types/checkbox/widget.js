import React from "react";
import handler from "./widgetHandler";
import PriceAdjustment from '../../widget-inputs/WidgetPriceAdjustment';
import WidgetPricingInput from '../../widget-inputs/WidgetPricingInput.js';
import {OnOffToggleField} from "servicebot-base-form";
let Checkbox = (props) => {
    let {input, currency, configValue, label, meta: {touched, error, warning}} = props;
    return (
        <div className={`sb-form-group _addon-checkbox-widget${error && touched ? " has-error" : ""}`}>
            <div className="_label-wrapper">
                {label && <label className="_label-">{label}</label>}
                {configValue && configValue.pricing && configValue.pricing.value && <PriceAdjustment currency={currency} price={configValue.pricing.value} operation={configValue.pricing.operation}/>}
            </div>
            <div className="_input-container-">
                <OnOffToggleField faIcon="check" color="#0091EA" input={input} type="checkbox"/>
            </div>
        </div>
    );
};
let Price = (props) => {
    let config = props.configValue;
    return (
        <div className={`addon-checkbox-widget-price-inputs-wrapper`}>
            <div className="sb-form-group _addon-checkbox-widget-price">
                <WidgetPricingInput currency={props.currency} input={props.input} operation={config && config.pricing && config.pricing.operation}/>
                {/*<CurrencyInput {...props.input} className="form-control addon-checkbox-widget-price-input"*/}
                               {/*prefix="$" decimalSeparator="." thousandSeparator="," precision="2"*/}
                {/*/>*/}
            </div>
        </div>
    );
};

let widget = {
    widget : Checkbox,
    type : "checkbox",
    label : "Checkbox",
    pricing: Price,
    handler : handler
};


export default widget