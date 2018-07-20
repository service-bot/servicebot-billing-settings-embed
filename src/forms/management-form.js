import React from 'react';
import {Fetcher} from 'servicebot-base-form';
import {Price, getPrice} from '../utilities/price.js';
import DateFormat from "../utilities/date-format.js";
import {BillingForm} from "./billing-settings-form.js";
import {injectStripe} from "react-stripe-elements";
import {connect} from "react-redux";
import {ModalEditProperties} from "./edit-properties-form.js"
import TierChoose from "./TierChooser"
import {PriceBreakdown} from "../utilities/widgets";
import Load from "../utilities/load.js";

function PriceSummary(props){
    let {instance, template} = props;

    return (
        <div className="_items">
            <PriceBreakdown instance={instance} inputs={instance.references.service_instance_properties}/>
            <p className="_total"><span className="_label">Total:</span><span className="_value">{getPrice(instance)}</span></p>
        </div>
    );
}
class ServicebotManagedBilling extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            instances: [],
            funds: [],
            fund_url : "api/v1/funds",
            spk: null,
            loading:true,
            cancel_modal: false,
            token: null,
            error: null,
            propEdit: false,
            currentInstance: {}
        };
        this.getServicebotDetails = this.getServicebotDetails.bind(this);
        this.requestCancellation = this.requestCancellation.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.getRequest = this.getRequest.bind(this);
        this.showPropEdit = this.showPropEdit.bind(this);
        this.hidePropEdit = this.hidePropEdit.bind(this);
        this.changePlan = this.changePlan.bind(this);

    }

    componentDidMount() {
        let self = this;
        self.getSPK();
        self.getServicebotDetails();
        self.getFundingDetails();
    }

    handleResponse(instance){
        let self = this;
        return async (response)=> {
            console.log(response);
            self.props.handleResponse && self.props.handleResponse({event: "add_fund",response});
            if(instance.status === "cancelled"){
                await self.resubscribe(instance.id)();
            }
            self.getFundingDetails();
            self.props.setLoading(false);

        }

    }
    async getFundingDetails(){
        let funds = await Fetcher(`${this.props.url}/api/v1/funds/own`, null, null, this.getRequest());
        this.setState({funds})
    }

    getRequest(method="GET", body){
        let headers = {
            "Content-Type": "application/json"
        };
        if(this.props.token){
            headers["Authorization"] = "JWT " + this.props.token;
        }
        let request = { method: method,
            headers: new Headers(headers),
        };
        if(method === "POST" || method==="PUT"){
            request.body = JSON.stringify(body)
        }
        return request;
    }
    getSubscriptionStatus(){
        let instance = this.state.instances[0];
        if(instance.status === "cancelled"){
            if(this.state.funds.length === 0 && instance.payment_plan && instance.payment_plan.amount > 0) {
                return <div>
                    <p className={"form-help-text"}><strong>Status: cancelled, please update credit/debit card to reactivate</strong></p>

                </div>
            }else{
                return <div>
                    <p className={"form-help-text"}><strong>Status: cancelled</strong></p>
                </div>
            }
        }else{
            return <div/>
        }

    }
    async getServicebotDetails() {
        let self = this;
        let instances = await Fetcher(`${self.props.url}/api/v1/service-instances/own`, "GET", null, this.getRequest("GET"));
        if(!instances.error && instances.length > 0){
            let template = await Fetcher(`${self.props.url}/api/v1/service-templates/${instances[0].service_id}/request`, "GET", null, this.getRequest("GET"))
            self.setState({instances, template});
        }else{
            self.setState({error: instances.error})

        }
    }

    getSPK(){
        let self = this;
        fetch(`${this.props.url}/api/v1/stripe/spk`)
            .then(function(response) {
                return response.json()
            }).then(function(json) {
            self.setState({spk : json.spk});
        }).catch(e => console.error(e));
    }

    requestCancellation(id){
        this.props.setLoading(true);

        let self = this;
        let body = {
            instance_id : id
        };
        Fetcher(`${this.props.url}/api/v1/service-instances/${id}/request-cancellation`, null, null, this.getRequest("POST", body)).then(function (response) {
            if (!response.error) {
                self.getServicebotDetails();
                self.props.handleResponse && self.props.handleResponse({event: "cancellation", response});
                self.props.setLoading(false);
            }
        });
    }

    getTrialStatus(){
        let self = this;
        //Get service trial status
        if(self.state.instances.length > 0) {
            let inTrial = false;
            let trialExpires = '';
            let instance = self.state.instances[0];
            if(!instance.trial_end){
                return null;
            }
            let trial = new Date(instance.trial_end * 1000);
            let date_diff_indays = (date1, date2) => {
                let dt1 = new Date(date1);
                let dt2 = new Date(date2);
                return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24));
            };
            if(instance.status === "running") {
                let currentDate = new Date();
                //Service is trialing if the expiration is after current date
                if(currentDate < trial) {
                    inTrial = true;
                    trialExpires = `${date_diff_indays(currentDate, trial)} days`;
                }
            }
            if(inTrial) {
                if(self.state.funds.length === 0) {
                    return (
                        <div className="sb-trial-notice">
                            <p className={"form-help-text"}><strong>{trialExpires} left of the trial </strong> and you have no funding source. Your subscription will be deactivated after trial expiration date. If you would like to continue your service, please update your credit/debit card below.</p>
                        </div>
                    )
                } else {
                    return (
                        <div className="sb-trial-notice">
                            <p className={"form-help-text"}><strong>{trialExpires} left of the trial. </strong> The initial payment will be charged once trial expires.</p>
                        </div>
                    )
                }
            } else {
                return (null);
            }
        } else {
            return (null);
        }
    }

    getBillingForm(){
        let self = this;
        let fund = self.state.funds[0];
        let buttonText = "Subscribe";
        if(fund){
            buttonText ="Update Card";
        }
        if(self.state.instances[0].status === "cancelled"){
            buttonText="Resubscribe"
        }
        return (
            <div>
                {self.state.funds.length === 0 || !self.state.funds[0].source ?
                    <div className="mbf--funding-card-wrapper">
                        <h5 className="form-help-text">Add your funding credit/debit card.</h5>
                        <BillingForm buttonText={buttonText}
                                     handleResponse={self.handleResponse(self.state.instances[0])}
                                     token={self.props.token} spk={self.state.spk}
                                     external={self.props.external}
                                     submitAPI={`${self.props.url}/${self.state.fund_url}`} />
                    </div>
                    :
                    <div>
                        <BillingForm handleResponse={self.handleResponse(self.state.instances[0])}
                                     buttonText={buttonText}
                                     token={self.props.token}
                                     spk={self.state.spk}
                                     external={self.props.external}
                                     submitAPI={`${self.props.url}/${self.state.fund_url}`} userFund={fund} />
                    </div>

                }
            </div>
        );
    }
    showPropEdit(instance) {
        let self = this;
        return function() {
            self.setState({propEdit: true, currentInstance : instance});
        }
    }

    hidePropEdit(e) {
        this.setState({propEdit: false});
        this.getServicebotDetails();

    }
    changePlan (paymentStructure){
        let self = this;
        return async function(e) {
            let headers = {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            };
            if (self.props.token) {
                headers["Authorization"] = `JWT ${self.props.token}`;
            }

            let request = {
                method: "POST",
                headers
            }

            self.props.setLoading(true);
            // self.setState({loading: true});
            let updatedInstance = await(await fetch(`${self.props.url}/api/v1/service-instances/${self.state.instances[0].id}/apply-payment-structure/${paymentStructure}`,request)).json();
            console.log(updatedInstance, "hello!")
            if(updatedInstance.error === "This customer has no attached payment source"){
                self.setState({formError: "Credit/debit card required to switch from free tier to a paid tier"});
            }
            await self.getServicebotDetails();
            // self.setState({loading: false});
            self.props.setLoading(false);

        }
    }

    resubscribe(id){
        return async ()=>{
            let self = this;
            self.props.setLoading(true);
            let headers = {
                "Content-Type": "application/json",
                'Accept': 'application/json'
            };
            if (this.props.token) {
                headers["Authorization"] = `JWT ${this.props.token}`;
            }

            const URL = this.props.url;

            self.setState({loading:true});
            let updatedInstance = await (await fetch(`${URL}/api/v1/service-instances/${id}/reactivate`, {
                method : "POST",
                headers
            })).json();
            await self.getServicebotDetails();
            self.props.handleResponse && self.props.handleResponse({event: "resubscribe", response: updatedInstance});
            self.props.setLoading(false);
        }
    }

    render () {

        let self = this;
        if(this.state.error){
            return <p>{this.state.error}</p>
        }

        let metricProp = self.state.template && self.state.template.references.service_template_properties.find(prop => prop.type === "metric");

        console.log(self.state.instances);
        return (
            <div className="servicebot--embeddable servicebot--manage-billing-form-wrapper custom">

                <div className="mbf--form-wrapper">
                    {self.state.instances.length > 0 ?
                        <div className="app-content">
                                {/*todo: style this when it's available or designed */}
                                {self.state.instances.length > 0 ?
                                    <div className="mbf--subscription-summary-wrapper">
                                        <h3>Subscription Summary</h3>
                                            <div className="mbf--current-services-list">
                                                {self.state.instances.map(service => {
                                                    return(
                                                    <div className="mbf--current-services-item">
                                                        {this.getSubscriptionStatus()}
                                                        {this.getTrialStatus()}
                                                        <PriceBreakdown metricProp={metricProp} instance={service}/>
                                                        <TierChoose key={"t-" + service.payment_structure_template_id} changePlan={self.changePlan} currentPlan={service.payment_structure_template_id} template={self.state.template}/>
                                                        {/*<div className="mbf--current-services-item-details">*/}
                                                            {/*<h6 className="mbf--current-services-item-title">{service.name}</h6>*/}
                                                            {/*<b><Price value={service.payment_plan.amount} /> / {service.payment_plan.interval}</b><br/>*/}
                                                        {/*</div>*/}
                                                        {/*<div className="service-instance-box-content">*/}
                                                            {/*<div>Status: <b>{service.status}</b></div>*/}
                                                            {/*<div>Purchased: <b><DateFormat date={service.created_at} time/></b></div>*/}
                                                        {/*</div>*/}
                                                        <div className="mbf--current-services-item-buttons">
                                                            <span>{this.state.formError}</span>
                                                            {(service.status === "running" || service.status === "requested" || service.status === "in_progress") &&
                                                            <button className="buttons _right _rounded mbf--btn-cancel-service"
                                                                    onClick={this.requestCancellation.bind(this, service.id)}>Cancel Service</button>
                                                            }
                                                            {service.status === "cancelled" && self.state.funds[0] &&
                                                            <button className="buttons _right _rounded mbf--btn-resubscribe-service"
                                                                    onClick={self.resubscribe(service.id)}>Resubscribe</button>}
                                                            <div className={`clear`}/>
                                                        </div>
                                                    </div>
                                                )})}
                                            </div>
                                        </div>
                                    :
                                    <div><p>You currently don't have any subscriptions.</p></div>
                                }
                                <h3>Payment Information</h3>
                                {this.getBillingForm()}

                                <ModalEditProperties external={this.props.external} token={this.props.token} url={this.props.url} instance={self.state.instances[0]} refresh={this.hidePropEdit}/>
                        </div>
                        :
                        <div className="page-loader">
                            <Load>
                                <p className="page-loader-text">Billing Management</p>
                            </Load>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

let mapDispatchToProps = function(dispatch){
    return {
        setLoading : function(is_loading){
            dispatch({type: "SET_LOADING", is_loading});
        }}
}

ServicebotManagedBilling = connect(null, mapDispatchToProps)(ServicebotManagedBilling);
export default ServicebotManagedBilling