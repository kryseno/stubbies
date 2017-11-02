import React, {Component} from 'react';
import JoinEvent from './joinEvent';
import axios from 'axios';

import './join.css';

class Join extends Component {
    constructor (props) {
        super (props);

        this.state = {
            showJoinDiv: false,
        }

        this.clickHandler = this.clickHandler.bind(this);
        this.joinDivShow = this.joinDivShow.bind(this);
        this.joinDivHide = this.joinDivHide.bind(this);
    }

    clickHandler() {
        console.log('join header was clicked');
        axios.post("http://localhost:4000/events")
            .then(function(response){
                console.log(response.data.data);     //this is the event data pulled from DB
            });
        this.setState({
            showJoinDiv: !this.state.showJoinDiv
        })
    }

    joinDivShow() {
        console.log('show is working');
        return (
            <div className="join" id="join">
                <h1 className="joinHeader" onClick={this.clickHandler}>Join an Event!</h1>
            </div>
        )
    }

    joinDivHide() {
        return (
            <div className="join" id="join">
                <h1 className="joinHeader" onClick={this.clickHandler}>Join an Event!</h1>
                <JoinEvent show={this.state.showJoinDiv}/>
            </div>
        )
    }

    render() {
        console.log('showJoinDiv is:', this.state.showJoinDiv);
        return (
            <div className="col-sm-6 col-xs-12 joinContainer">
                {this.joinDivHide()}
            </div>
        )
    }
}

export default Join;