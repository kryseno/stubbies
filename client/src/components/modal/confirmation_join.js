import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import './confirmation_modal.css';

class ConfirmationModalJoin extends Component {
    constructor (props) {
        super (props);

        this.toggleModal = this.props.toggleModal;
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            showModal: nextProps.showModal
        })
    }

    render() {
        const {showModal, confirmStatus} = this.props;
        const status = {
            joinStatus: null,
            statusHeader: null
        }

        if (confirmStatus === "success") {
                status.joinStatus1 = "You have joined this event! A confirmation email will be sent within the hour. You can check the event you joined in your ",
                status.joinStatus2 = ""
                status.joinStatus3 = <Link to='/profile'>Profile</Link>
                status.statusHeader = "Success"
        } else if (confirmStatus === "error1") {
                status.joinStatus1 = "Cannot join: You are already registered in this event. Check your " 
                status.joinStatus2 = <Link to='/profile'>Profile</Link>
                status.joinStatus3 = " to view your Joined Events.",
                status.statusHeader = "Error"
        } else if (confirmStatus === "error2") {
                status.joinStatus1 = "Cannot join this event: The group size has reached its max.",
                status.joinStatus2 = ""
                status.joinStatus3 = "",
                status.statusHeader = "Error"
        } else {
            status.joinStatus = "An error occured... Try again later."
            status.statusHeader = "Error"
        }

        if(!showModal){
            return null;
        }

        return (
            <div className={`modal confirmModal ${showModal ? '' : ' hidden'}`} role="dialog">
                <div className="modal-dialog confirmDialog">
                    <div className="modal-content confirmContent">
                        <div className="modal-header">
                            <button onClick={this.toggleModal} type="button" className="close">&times;</button>
                            <h4 className="modal-title">{status.statusHeader}</h4>
                        </div>
                        <div className="modal-body confirmBody">
                            <p>{status.joinStatus1}{status.joinStatus2}{status.joinStatus3}</p>
                        </div>
                        <div className="modal-footer col-sm-12 col-xs-12">
                            <button type="button" className="btn btn-default col-sm-12 col-xs-12" onClick={this.toggleModal}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ConfirmationModalJoin;
