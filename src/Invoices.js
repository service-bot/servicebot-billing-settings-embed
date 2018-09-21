import React from "react";
import {Price} from './utilities/price.js';
import DateFormat from './utilities/date-format.js';


function Invoice(props){
    let {invoice, user, cancel} = props;
    console.log("invoice", invoice);
    return (
        <div className={`servicebot-invoice-modal-container`}>
            <div className={`__modal`}>
                <div className={`__header`}>
                    <div className={`__inner`}>
                        <div className={`__left`}>
                            <h3>Ben Sears</h3>
                            <span className={`__invoice-id`}>{invoice.invoice_id}</span>
                        </div>
                        <div className={`__right`}>
                            <span className={`__date`}><DateFormat date={invoice.date}/></span>
                            <span role={`button`}
                                  aria-label={`close invoice modal`}
                                  className={`icon close`}
                                  onClick={cancel}/>
                        </div>
                    </div>
                </div>
                <div className={`__body`}>
                    <h4 className={`__heading`}>Summary</h4>
                    <span>Amount: <Price value={invoice.total} currency={invoice.currency}/></span>
                    <span>Date: <DateFormat date={invoice.date}/></span>
                    <span>Summary</span>
                    {invoice.references.user_invoice_lines.map((line, index) => {
                        return <div key={index}>
                            <span>{line.description}</span>
                            <span>Amount: <Price value={line.amount} currency={line.currency}/></span>
                        </div>
                    })}
                    <span>Total: <Price value={invoice.total} currency={invoice.currency}/></span>
                </div>
            </div>
            <div onClick={cancel} className={`__backdrop`}/>
        </div>
        );
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
        let {invoices, user} = this.props;
        let {invoiceToShow} = this.state;
        if (!invoices || invoices.length === 0) {
            return <div></div>
        }

        return <div className={`servicebot-billing-invoices`}>
            {invoiceToShow !== null && <Invoice cancel={this.cancel} user={user} invoice={invoices[invoiceToShow]}/>}
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
                    <li key={index} className={`__list-items`}>
                        <span className={`__invoice-id`}>{invoice.invoice_id.slice(3)}</span>
                        <span className={`__invoice-date`}><DateFormat month={true} date={invoice.date}/></span>
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