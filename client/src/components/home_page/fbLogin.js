import React, { Component } from 'react';
import { userAuth } from '../../actions';
import { connect } from 'react-redux';


class FacebookLogin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false
        }
        this.renderLogin = this.renderLogin.bind(this);
    }

    componentWillMount() {
        this.renderLogin();
    }

    renderLogin() {

        this.props.userAuth().then((resp) => {
            console.log('response: ', resp);
            this.setState({
                isLoggedIn: resp.payload.data.isLoggedIn
            })
        }).catch((resp) => {
            console.log("This is the error", resp);
        })
    }


    render() {
        const { isLoggedIn } = this.state;
        if (isLoggedIn) {
            return <a href="/logout" className="btn-sm btn-primary"><span className="fa fa-facebook"></span> Log Out</a>
        } else {
            return <a href="/auth/facebook" className="btn-sm btn-primary"><span className="fa fa-facebook"></span> Log in With Facebook</a>
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userAuth
    }
}

export default connect(mapStateToProps, { userAuth })(FacebookLogin);
