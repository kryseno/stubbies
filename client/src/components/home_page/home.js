import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './home.css';
// import Passport from '../../assets/images/passport_js.png';
// import MeisterTask from '../../assets/images/meistertask.png';
import Logo from '../../assets/images/logo.png';

class Home extends Component {
    render() {
        return (
            <div className="container">
                <div className="banner col-sm-12 col-xs-12">
                    <img src={Logo}/>
                    <h2>You don't have to study lonely, with stubbies!</h2>
                </div>

                <div className="about col-sm-12 col-xs-12">
                    <h1>Get Started</h1>
                    <hr/>
                    <p>Find others who are studying the same subject as you and meet up with them with just a few easy clicks!</p>
                    <p>Click <b>Join Event</b> to browse through all the events to find the one you want to join.</p>
                    <p>Click <b>Create Event</b> to create an event that others can join.</p>
                </div>
            </div>
        )
    }
}

export default Home;