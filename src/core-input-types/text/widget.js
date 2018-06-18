import React from "react";


let Text = (props) => {
    let {meta: {touched, error, warning}} = props;
    return (
        <div className={`addon-text-widget-input-wrapper`}>
            <input className={`form-control addon-text-widget-input${error && touched ? " has-error" : ""}`} {...props.input} type="text" placeholder={props.label}/>
        </div>
    );
};



let widget =     {widget : Text, type : "text", label : "Text"};

export default widget