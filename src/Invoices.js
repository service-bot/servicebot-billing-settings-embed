import React from "react";
import {Price} from './utilities/price.js';
import DateFormat from './utilities/date-format.js';
import ReactToPrint from "react-to-print";

class Invoice extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        let {invoice, user, cancel} = this.props;
        return (
            <div className={`servicebot-invoice-modal-container`} ref={el => (this.componentRef = el)}>
                <div className={`__modal`}>
                    <div className={`__header`}>
                        <div className={`__inner`}>
                            <div className={`__left`}>
                                <h3>{user.name || user.email}</h3>
                                <span className={`__invoice-id`}>Invoice #: {invoice.invoice_id}</span>
                                <span className={`__date`}><DateFormat date={invoice.date}/></span>
                            </div>
                            <div className={`__right`}>
                            <span role={`button`}
                                  aria-label={`close invoice modal`}
                                  className={`icon close`}
                                  onClick={cancel}/>
                            </div>
                        </div>
                    </div>
                    <div className={`__body`}>
                        <h4 className={`__heading`}>Summary</h4>
                        <div className={`mbf-summary`}>
                            <p className={`_heading`}>Items</p>
                            <div className={`_items`}>
                                {invoice.references.user_invoice_lines.map((line, index) => {
                                    return (
                                        <p key={index} className={`_item`}>
                                            <span className={`_label`}>{line.description}</span>
                                            <span className={`_value_wrap`}>
                                        <span className={`_value`}>
                                            <Price value={line.amount} currency={line.currency}/>
                                        </span>
                                    </span>
                                        </p>
                                    );
                                })}
                            </div>
                            <p className={`_total`}>
                                <span className={`_label`}>Total: </span>
                                <span className={`_value`}><Price value={invoice.total}
                                                                  currency={invoice.currency}/></span>
                            </p>
                        </div>
                    </div>
                    <div className={`__footer`}>
                        <ReactToPrint
                            copyStyles={true}
                            trigger={() => <button onClick={(e) => {
                                window.print();
                                return false;
                            }} className={`buttons _primary _download-invoice`}>Print Invoice</button>}
                            content={() => this.componentRef}
                        />
                    </div>
                </div>
                <div onClick={cancel} className={`__backdrop`}/>
            </div>
        );
    }
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