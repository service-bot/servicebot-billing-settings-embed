import React from "react";

let CreditCardIcon = (brand) => {

    brand = brand.toLowerCase();

    switch (brand) {

        case 'visa':
            return (
                <div className="card visa">
                    <p>VISA</p>
                </div>
            );
        case 'master':
        case 'master card':
        case 'mastercard':
        case 'MasterCard':
            return (
                <div className="card mc">
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <p>MasterCard</p>
                </div>
            );
        case 'discover':
            return (
                <div className="card discover">
                    <p>Discover</p>
                </div>
            );
        case 'amex':
        case 'american express':
        case 'American Express':
            return (
                <div className="card amex">
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <hr/>
                    <svg className='svg' height="100%" width="100%">
                        <text x="11%" y="45%" fill="none" stroke="#fff" strokeWidth="1%">AMERICAN</text>
                    </svg>
                    <svg className='svg' height="100%" width="100%">
                        <text x="30%" y="72%" fill="none" stroke="#fff" strokeWidth="1%">EXPRESS</text>
                    </svg>
                </div>
            );
        default:
            return (
                <div className="card back"><span/></div>
            );

    }
};

export default CreditCardIcon;