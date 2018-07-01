import React from "react";

function Adjustment(props){
    let {operation, price} = props;
    //todo: make this less hardcoded.
    let message = "";
    if(operation === "add" || operation === "subtract") {
        price = (price / 100).toFixed(2)
    }
    switch(operation) {
        case "add":
            message = <span>+ ${price}</span>;
            break;
        case "subtract":
            message = <span>- ${price}</span>;

            break;
        case "multiply" :
            message = <span>+ ${price}%</span>;

            break;
        case "divide" :
            message = <span>- ${price}%</span>;
            break;
        default :
            message = ` -- ${operation} : ${price}`;
            break;
    }
    return (
        <span className="_price-adjustment-label">
            {message}
        </span>
    );
}

export default Adjustment;