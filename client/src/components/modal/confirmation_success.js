import React, {Component} from 'react';

import './confirmation_modal.css';

class ConfirmationModalCreate extends Component {
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

        if(!showModal){
            return null;
        }

        if (confirmStatus === "success") {
            return (
                <div className={`modal confirmModal ${showModal ? '' : ' hidden'}`} role="dialog">
                    <div className="modal-dialog confirmDialog">
                        <div className="modal-content confirmContent">
                            <div className="modal-header">
                                <button onClick={this.toggleModal} type="button" className="close">&times;</button>
                                <h4 className="modal-title">Success</h4>
                            </div>
                            <div className="modal-body confirmBody">
                                <p>Your event has been created! A confirmation email will be sent within the hour.</p><br/>
                                <p>You can check the event you created in your profile or the Join page.</p>
                            </div>
                            <div className="modal-footer col-sm-12 col-xs-12">
                                <button type="button" className="btn btn-default col-sm-12 col-xs-12" onClick={this.toggleModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className={`modal confirmModal ${showModal ? '' : ' hidden'}`} role="dialog">
                    <div className="modal-dialog confirmDialog">
                        <div className="modal-content confirmContent">
                            <div className="modal-header">
                                <button onClick={this.toggleModal} type="button" className="close">&times;</button>
                                <h4 className="modal-title">Error</h4>
                            </div>
                            <div className="modal-body confirmBody">
                                <p>Something went wrong. Your event has not been created. Try again!</p>
                            </div>
                            <div className="modal-footer col-sm-12 col-xs-12">
                                <button type="button" className="btn btn-default col-sm-12 col-xs-12" onClick={this.toggleModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default ConfirmationModalCreate;
