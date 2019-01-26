import React from 'react';
import {connect} from "react-redux"
class Load extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type || 'content',
            message: "Loading...",
            loadState: "loading"
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log("embed loader nextProps", nextProps);
        if(!nextProps.loading && this.props.finishLoading){
            console.log('finish laoding');
            this.props.finishLoading();
        }
    }

    render () {
        let {loading, disableLoader, className} = this.props;

        if(disableLoader === true){
            {console.log('embed-oader-disabled')}
            return <div className={`page-loader-disabled`}/>
        }else if(loading){
            {console.log('embed-loader-showing')}
            return <div className={`page-loader ${className||''}`}>
                    <div className="lds-ellipsis"><div/><div/><div/><div/></div>
                </div>
        }else{
            {console.log('embed-loader-done')}
            return <div className={`page-loader-done`}/>
        }
    }
}
function mapStateToProps(state) {
    return {
        loading: state.loading,
        disabledLoader: state.disableLoader
    }
}


export default connect(mapStateToProps)(Load);
