import React from 'react';
import {connect} from "react-redux"
import {getFormValues} from "redux-form";
class Load extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type || 'content',
            message: "Loading...",
            loadState: "loading",
            show: false,
        };
    }

    componentDidMount() {
        let self = this;
        let {timeout, delayed, show} = this.props;

        if(delayed !== false){
            this.delayed = setTimeout(function () {
                self.setState({
                    show: true
                })
            }, 300)
        }

        if(this.props.timeout !== false ){
            this.timeout = setTimeout(function(){
                self.setState({message: "There seems to be a problem in processing your request. Please try again.", loadState: "done" });
            }, this.props.timeout || 10000);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
        clearTimeout(this.delayed);
    }

    render () {
        let {timeout, delayed, show, loading} = this.state;
        if(show && loading){
            return(
                <div className="loader">
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                    {this.props.children}
                </div>
            );
        }else{
            return(
                <div/>
            )
        }
    }
}
function mapStateToProps(state) {
    return {
        loading: state.loading
    }
}


export default connect(mapStateToProps)(Load);
