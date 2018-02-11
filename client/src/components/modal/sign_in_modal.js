import React, { Component } from 'react';
import FacebookLogin from '../home_page/fbLogin';

import './sign_in.css';

class SignInModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showSignInModal: this.props.showSignInModal,
        }

        this.toggleSignInModal = this.props.toggleSignInModal;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            showSignInModal: nextProps.showSignInModal
        })
    }

    render() {
        const { showSignInModal } = this.props;

        if (!showSignInModal) {
            return null;
        }
        return (
            <div className={`modal signInModal ${showSignInModal ? '' : ' hidden'}`} role="dialog">
                <div className="modal-dialog signinDialog">
                    <div className="modal-content signinContent">
                        <div className="modal-header">
                            <button onClick={this.toggleSignInModal} type="button" className="close">&times;</button>
                            <h4 className="modal-title">Please Log In</h4>
                        </div>
                        <div className="modal-body signinBody">
                            <p>Please Log in if you would like to create an event.</p>
                            <FacebookLogin/>  
                        </div>
                        <div className="modal-footer col-sm-12 col-xs-12">
                            <button type="button" className="btn btn-default col-sm-12 col-xs-12" onClick={this.toggleSignInModal}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default SignInModal;

