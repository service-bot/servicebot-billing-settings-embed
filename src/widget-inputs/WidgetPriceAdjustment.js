import React from "react";
import getSymbolFromCurrency from 'currency-symbol-map'


function Adjustment(props){
    let {operation, price, isText, currency} = props;
    let currencySymbol = currency ? getSymbolFromCurrency(currency) : "$";
    //todo: make this less hardcoded.
    let message = "";
    if(operation === "add" || operation === "subtract") {
        price = (price / 100).toFixed(2)
    }
    switch(operation) {
        case "add":
            message = isText? `${currencySymbol}${price} Add-on`: <div>{currencySymbol}{price} <span class="request-form-price-adjust-discount">Add-on</span></div>;
            break;
        case "subtract":
            message = isText? `${currencySymbol}${price} Discount`:<div>${price} <span class="request-form-price-adjust-discount">Discount</span></div>;

            break;
        case "multiply" :
            message = isText? `${price}% Increase`:<div>${price}% <span className="request-form-price-adjust-increase">Increase</span></div>;

            break;
        case "divide" :
            message = isText? `${price}% Discount`:<div>${price}% <span class="request-form-price-adjust-decrease">Discount</span></div>;
            break;
        default :
            message = ` -- ${operation} : ${price}`;
            break;
    }
    if(isText){
        return message;
    }
    return (
        <div className="request-form-price-adjustment-wrapper">
            {message}
        </div>
    );

}

export default Adjustment;