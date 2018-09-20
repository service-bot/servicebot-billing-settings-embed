import React from "react";
import {Price} from './utilities/price.js';
import DateFormat from './utilities/date-format.js';


function Invoice(props){
    let {invoice, cancel} = props;
    return <div className={`servicebot-invoice-modal`}>
        <span>Amount: <Price value={invoice.total} currency={invoice.currency}/></span>
        <span>Date: <DateFormat date={invoice.date}/></span>
        <span>Summary</span>
        {invoice.references.user_invoice_lines.map(line => {
            return <div>
                <button onClick={cancel}>X</button>
                <span>{line.description}</span>
                <span>Amount: <Price value={line.amount} currency={line.currency}/></span>
            </div>
        })}
        <span>Total: <Price value={invoice.total} currency={invoice.currency}/></span>





    </div>
}
class Invoices extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            invoiceToShow : null
        }
        this.cancel = this.cancel.bind(this);
        this.viewInvoice = this.viewInvoice.bind(this);

    }

    cancel(){
        this.setState({invoiceToShow : null});
    }
    viewInvoice(invoiceToShow){
        let self = this;
        return function(e){
            self.setState({invoiceToShow})
        }
    }
    render() {
        let {invoices} = this.props;
        let {invoiceToShow} = this.state;
        if (!invoices || invoices.length === 0) {
            return <div></div>
        }
        console.log(invoices);

        return <div className={`servicebot-billing-invoices`}>
            {invoiceToShow !== null && <Invoice cancel={this.cancel} invoice={invoices[invoiceToShow]}/>}
            <h3>Billing Invoice</h3>
            <ul className={`__invoice-list-header`}>
                <li>Invoice ID</li>
                <li>Date</li>
                <li>Amount</li>
                <li>Action</li>
            </ul>
            <ul className={`__invoice-list`}>
            {invoices.map((invoice, index) => {
                return (
                    <li className={`__list-items`}>
                        <span className={`__invoice-id`}>{invoice.invoice_id}</span>
                        <span className={`__invoice-date`}><DateFormat date={invoice.date}/></span>
                        <span className={`__invoice-amount`}><Price value={invoice.total} currency={invoice.currency}/></span>
                        <span className={`buttons __invoice-button`} onClick={this.viewInvoice(index)}>View Invoice</span>
                    </li>
                )
            })}
            </ul>
        </div>
    }
}
export default Invoices