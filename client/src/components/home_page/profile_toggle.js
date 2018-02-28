import React, { Component } from 'react';
import { userAuth } from '../../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


class ProfileLinkToggle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false
        }
        this.renderProfileLink = this.renderProfileLink.bind(this);
    }

    componentWillMount() {
        this.renderProfileLink();
    }

    renderProfileLink() {

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
            return <Link to='/profile'>Profile</Link>;
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userAuth
    }
}

export default connect(mapStateToProps, { userAuth })(ProfileLinkToggle);
