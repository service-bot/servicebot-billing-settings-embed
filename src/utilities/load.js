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

    render () {
        let {className} = this.props;

        if(this.props.loading){
            return (
                <div className={`page-loader ${className||''}`}>
                    <div className="lds-ellipsis"><div/><div/><div/><div/></div>
                </div>
            );
        }else{
            return <div className={`page-loader-done`}/>;
        }
    }
}
function mapStateToProps(state) {
    return {
        loading: state.loading
    }
}


export default connect(mapStateToProps)(Load);
