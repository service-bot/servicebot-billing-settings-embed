import React from 'react';
import {Fetcher} from 'servicebot-base-form';
import {Price} from '../utilities/price.js';
import DateFormat from "../utilities/date-format.js";
import {BillingForm} from "./billing-settings-form.js";
import '../../css/managed.css';
import {injectStripe} from "react-stripe-elements";
import {connect} from "react-redux";
import {ModalEditProperties} from "./edit-properties-form.js"
import TierChoose from "./TierChooser"


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
                        <div className="trial-notice red">
                            <strong>{trialExpires} left of the trial </strong> and you have no funding source. Your subscription will be deactivated after trial expiration date. If you would like to continue your service, please update your credit/debit card below.
                        </div>
                    )
                } else {
                    return (
                        <div className="trial-notice blue">
                            <strong>{trialExpires} left of the trial. </strong> The initial payment will be charged once trial expires.
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
                        <h5 className="mbf--add-funding-message">Add your funding credit/debit card.</h5>
                        <BillingForm buttonText={buttonText}
                                     handleResponse={self.handleResponse(self.state.instances[0])}
                                     token={self.props.token} spk={self.state.spk}
                                     submitAPI={`${self.props.url}/${self.state.fund_url}`} />
                    </div>
                    :
                    <div>
                        <BillingForm handleResponse={self.handleResponse(self.state.instances[0])}
                                     buttonText={buttonText}
                                     token={self.props.token}
                                     spk={self.state.spk}
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


            self.setState({loading: true});
            let updatedInstance = await(await fetch(`${self.props.url}/api/v1/service-instances/${self.state.instances[0].id}/apply-payment-structure/${paymentStructure}`,request)).json();
            await self.getServicebotDetails();
            self.setState({loading: false});

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
        let buttonStyle = {
            backgroundColor: "#d32f2f",
            border: "none",
            color: "#ffffff"
        };
        let buttonStyle2 = {
            backgroundColor: "#0054d3",
            border: "none",
            color: "#ffffff"
        };

        return (
            <div className="servicebot--embeddable servicebot--manage-billing-form-wrapper custom">

                <div className="mbf--form-wrapper">
                    {self.state.instances.length > 0 ?
                        <div className="">
                                {this.getTrialStatus()}
                                <h4>Account Billing</h4>
                                {this.getBillingForm()}
                                <hr/>

                                <h4>Manage Account</h4>
                                <h5>Your current subscriptions are listed below:</h5>
                                {self.state.instances.length > 0 ?
                                    <div className="mbf--current-services-list">
                                        {self.state.instances.map(service => {
                                            return(
                                            <div className="mbf--current-services-item">
                                                <TierChoose key={"t-" + service.payment_structure_template_id} changePlan={self.changePlan} currentPlan={service.payment_structure_template_id} template={self.state.template}/>
                                                <div className="mbf--current-services-item-details">
                                                    <h6 className="mbf--current-services-item-title">{service.name}</h6>
                                                    <b><Price value={service.payment_plan.amount} /> / {service.payment_plan.interval}</b><br/>
                                                </div>
                                                <div className="service-instance-box-content">
                                                    <div>Status: <b>{service.status}</b></div>
                                                    <div>Purchased: <b><DateFormat date={service.created_at} time/></b></div>
                                                </div>
                                                <div className="mbf--current-services-item-buttons">
                                                    {(service.status === "running" || service.status === "requested" || service.status === "in_progress") &&
                                                    <button className="btn btn-default btn-rounded btn-sm m-r-5" style={buttonStyle} onClick={this.requestCancellation.bind(this, service.id)}>Cancel Service</button>
                                                    }
                                                    {service.status === "cancelled" && self.state.funds[0] && <button className="btn btn-default btn-rounded btn-sm m-r-5" style={buttonStyle2} onClick={self.resubscribe(service.id)}>Resubscribe</button>}
                                                </div>
                                            </div>
                                        )})}
                                        <ModalEditProperties token={this.props.token} url={this.props.url} instance={self.state.instances[0]} hide={this.hidePropEdit}/>
                                    </div>
                                    :
                                    <div><p>You currently don't have any subscriptions.</p></div>
                                }

                        </div>
                        :
                        <div className="page-loader">
                            <div className="lds-ellipsis"><div/><div/><div/><div/></div>
                            <p className="page-loader-text">Billing Management</p>
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