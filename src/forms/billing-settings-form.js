import React from 'react';
import {Elements, injectStripe, CardElement, StripeProvider} from 'react-stripe-elements';
import {ServicebotBaseForm, inputField} from "servicebot-base-form"
import {get, has} from "lodash";
import {Field,} from 'redux-form'
import Buttons from "../utilities/buttons.js";
import {connect} from "react-redux";

class CardSection extends React.Component {
    render() {
        return (
            <div className="form-group" id="card-element">
                <CardElement style={{
                    base: {
                        color: '#32325d',
                        lineHeight: '24px',
                        fontFamily: 'Helvetica Neue',
                        fontSmoothing: 'antialiased',
                        fontSize: '16px',
                        '::placeholder': {
                            color: '#aab7c4'
                        }
                    },
                    invalid: {
                        color: '#fa755a',
                        iconColor: '#fa755a'
                    }
                }}/>
            </div>
        );
    }
}

class BillingForm extends React.Component {
    render() {
        return (
            <StripeProvider apiKey={this.props.spk || "no_public_token"}>
                <Elements id="payment-form">
                    <CreditCardForm {...this.props}/>
                </Elements>
            </StripeProvider>

        )
    }
}

function BillingInfo(props) {
    console.log(props);
    return (
        <form className="mbf--funding-personal-info">
            <CardSection/>
            <Field name="name" type="text" component={inputField} placeholder="Name on the card"/>
            <Field name="address_line1" type="text" component={inputField} placeholder="Address"/>
            <Field name="address_city" type="text" component={inputField} placeholder="City"/>
            <Field name="address_state" type="text" component={inputField} placeholder="State"/>
            <button onClick={props.handleSubmit} type="submit">Save Card</button>
        </form>
    )
}

class CreditCardForm extends React.Component {
    constructor(props) {
        super(props);
        let state = {
            hasCard: false,
            loading: true,
            card: {},
            alerts: null,
            showForm: true
        };
        if(props.userFund){
            state.hasCard= true;
            state.showForm = false;
            state.card = props.userFund.source.card;
        }
        this.state = state;
        this.submissionPrep = this.submissionPrep.bind(this);
        // this.checkIfUserHasCard = this.checkIfUserHasCard.bind(this);
        this.handleSuccessResponse = this.handleSuccessResponse.bind(this);
        this.handleFailureResponse = this.handleFailureResponse.bind(this);
        this.showPaymentForm = this.showPaymentForm.bind(this);
        this.hidePaymentForm = this.hidePaymentForm.bind(this);
    }

    componentDidMount() {
        let self = this;
            self.setState({
                loading: false,
            });
    }

    async submissionPrep(values) {
        this.props.setLoading(true);
        let token = await this.props.stripe.createToken({...values});
        if (token.error) {
            let message = token.error;
            if(token.error.message) {
                message = token.error.message;
            }
            this.setState({ alerts: {
                type: 'danger',
                icon: 'times',
                message: message
            }});
            this.props.setLoading(false);
            throw token.error
        }
        return {user_id: this.props.uid, token_id: token.token.id};
    }

    // checkIfUserHasCard() {
    //     let self = this;
    //         Fetcher(`/api/v1/users/${self.props.uid}`).then(function (response) {
    //             if (!response.error) {
    //                 if (has(response, 'references.funds[0]') && has(response, 'references.funds[0].source.card')) {
    //                     let fund = get(response, 'references.funds[0]');
    //                     let card = get(response, 'references.funds[0].source.card');
    //                     self.setState({
    //                         loading: false,
    //                         displayName: response.name || response.email || "You",
    //                         hasCard: true,
    //                         fund: fund,
    //                         card: card,
    //                         personalInformation: {
    //                             name: card.name || "",
    //                             address_line1: card.address_line1 || "",
    //                             address_city: card.address_city || "",
    //                             address_state: card.address_state || "",
    //                         }
    //                     }, function () {
    //                     });
    //                 } else {
    //                     self.setState({
    //                         loading: false,
    //                         showForm: true
    //                     });
    //                 }
    //             } else {
    //                 self.setState({loading: false, hasCard: false});
    //             }
    //         });
    // }

    handleSuccessResponse(response) {
        //If the billing form is passed in a callback, call it.

        if(this.props.handleResponse) {
            this.props.handleResponse(response);
            //Otherwise, set own alert.
        } else {
            this.setState({ alerts: {
                type: 'success',
                icon: 'check',
                message: 'Your card has been updated.'
            }});
            //re-render
            // this.checkIfUserHasCard();
        }
        this.props.setLoading(false);

    }

    handleFailureResponse(response) {
        if (response.error) {
            this.setState({ alerts: {
                type: 'danger',
                icon: 'times',
                message: response.error
            }});
        }
        this.props.setLoading(false);

    }

    showPaymentForm(){
        this.setState({ showForm: true });
    }

    hidePaymentForm(){
        this.setState({ showForm: false });
    }

    render() {
        let submissionRequest = {
            'method': 'POST',
            'url': `${this.props.url}/api/v1/funds`,
        };

        if(this.props.submitAPI) {
            submissionRequest.url = this.props.submitAPI;
        }


        let card = {}
        let {hasCard, displayName} = this.state;
        if(this.props.userFund){
            hasCard = true;
            card = this.props.userFund.source.card;
        }
        let {brand, last4, exp_month, exp_year} = card;

        let getBrandIcon = ()=>{
            if(brand === 'American Express'){
                return 'amex';
            }else{
                return `${brand.replace(/\s+/g, '-').toLowerCase()}`;
            }
        };

        let getCard = ()=>{
            if(hasCard) {
                return (
                    <div className="mbf--card-wrapper">
                        <div className="mbf--card-display">
                            <div className="mbf--card-chip"/>
                            <div className="mbf--card-number-holder">
                                <span className="mbf--card-first-12"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></span>
                                <span className="mbf--card-last4">{last4}</span>
                            </div>
                            <div className="mbf--card-info-holder">
                                <div className="mbf--card-date-holder">
                                    <span className="mbf--card-exp-month">{exp_month} / </span>
                                    <span className="mbf--card-exp-year">{exp_year}</span>
                                </div>
                                <span className="mbf--card-brand">{getBrandIcon()}</span>
                            </div>
                        </div>
                    </div>
                )
            }else{
                return (
                    <div className="mbf--card-wrapper no-card">
                        <div className="mbf--card-display">
                            <div className="mbf--card-chip"/>
                            <div className="mbf--card-number-holder">
                                <span className="mbf--card-first-12"><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></span>
                                <span className="mbf--card-last4">XXXX</span>
                            </div>
                            <div className="mbf--card-info-holder">
                                <div className="mbf--card-date-holder">
                                    <span className="mbf--card-exp-month">XX/ </span>
                                    <span className="mbf--card-exp-year">XXXX</span>
                                </div>
                                <span className="mbf--card-brand">Add Card</span>
                            </div>
                        </div>
                    </div>
                )
            }
        };

        let getAlerts = ()=>{
            if(this.state.alerts){
                return ( <Alerts type={this.state.alerts.type} message={this.state.alerts.message}
                                 position={{position: 'fixed', bottom: true}} icon={this.state.alerts.icon} /> );
            }
        };

        return (
            <div id="mbf--funding-form">
                <h3 className="mbf--your-funding-title">
                    <div className="mbf--your-funding-title-icon card icon"/>
                    <span className="mbf--your-funding-title-text">Your credit / debit card</span>
                </h3>
                {getAlerts()}
                {getCard()}
                {!this.state.showForm &&
                    <div className="mbf--update-funding-wrapper">
                        <div className="mbf--update-funding-wrapper-icon keyboard icon"/>
                        <p className="mbf--update-funding help-text">You can update your payment method by clicking on Update Payment</p>
                        <button className="btn btn-default btn-rounded mbf--btn-update-funding" onClick={this.showPaymentForm}>Update Payment</button>
                    </div>
                }
                {this.state.showForm &&
                    <div className="mbf--update-funding-wrapper">
                        <div className="mbf--funding-form-element">
                            <ServicebotBaseForm
                                form={BillingInfo}
                                formProps={{...this.props}}
                                initialValues={{...this.state.personalInformation}}
                                submissionPrep={this.submissionPrep}
                                submissionRequest={submissionRequest}
                                successMessage={"Fund added successfully"}
                                handleResponse={this.handleSuccessResponse}
                                handleFailure={this.handleFailureResponse}
                                reShowForm={true}
                                token={this.props.token} />
                        </div>
                        <button className="btn btn-default btn-rounded mf--btn-cancel-update-funding" onClick={this.hidePaymentForm}>Cancel</button>
                    </div>
                }
            </div>
        );
    }
}

let mapDispatchToProps = function(dispatch){
    return {
        setLoading : function(is_loading){
            dispatch({type: "SET_LOADING", is_loading});
        }}
};

CreditCardForm = injectStripe(CreditCardForm);
CreditCardForm = connect(null, mapDispatchToProps)(CreditCardForm);

export {CreditCardForm, BillingForm, CardSection};
