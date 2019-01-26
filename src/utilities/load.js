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
        if(!nextProps.loading && this.props.finishLoading){
            this.props.finishLoading();
        }
    }

    render () {
        let {loading, disableLoader, className} = this.props;

        if(disableLoader === true){
            return <div className={`page-loader-disabled`}/>
        }else if(loading){
            return <div className={`page-loader ${className||''}`}>
                    <div className="lds-ellipsis"><div/><div/><div/><div/></div>
                </div>
        }else{
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
