import React, { Component } from 'react';
import { userAuth } from '../../actions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


class JoinLinkToggle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoggedIn: false
        }
        this.renderJoinLink = this.renderJoinLink.bind(this);
    }

    componentWillMount() {
        this.renderJoinLink();
    }

    renderJoinLink() {

        this.props.userAuth().then((resp) => {
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
            return <Link to='/join-event'>Join Events</Link>;
        } else {
            return <Link to='/browse-event'>Browse Events</Link>
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.userAuth
    }
}

export default connect(mapStateToProps, { userAuth })(JoinLinkToggle);
