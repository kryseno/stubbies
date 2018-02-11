import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {userJoin, userAuth} from '../../actions';
import DetailsModal from '../modal/event_details_modal';
import ConfirmationModalJoin from '../modal/confirmation_join';

import './eventItem.css';

class EventDetails extends Component {
    constructor (props) {
        super (props);

        this.state = {
            showModalDetails: false,
            info: this.props.info,
            modalMessageConfirm: null,
            showModalConf: false,
            isLoggedIn: false
        }

        this.toggleModalDetails = this.toggleModalDetails.bind(this);
        this.toggleModalConf = this.toggleModalConf.bind(this);
        this.userJoinEvent = this.userJoinEvent.bind(this);

        this.renderMapAfterClick = this.renderMapAfterClick.bind(this);
        this.singleMap = this.singleMap.bind(this);
        this.axiosThenFunction = this.axiosThenFunction.bind(this);
    }

    /////////////////////////MAP////////////////////////
    renderMapAfterClick(){
        axios.post('https://maps.googleapis.com/maps/api/geocode/json?address='+this.state.info.location+'&key=AIzaSyBtOIVlRonYB8yoKftnhmhRT_Z8Ef-op3o')
            .then(this.axiosThenFunction);
    }

    axiosThenFunction(response){
        this.setState({
            coordinates: response.data.results[0].geometry.location
        });
        this.toggleModalDetails();
        this.singleMap();
    }

    singleMap() {
        const uluru = this.state.coordinates;
        const map = new google.maps.Map(document.getElementById('singleMap'), {
            zoom: 14,
            center: uluru
        });
        const marker = new google.maps.Marker({
            position: uluru,
            map: map,
            animation: google.maps.Animation.DROP, //BOUNCE //DROP
            // label: 'z'
        });
    }
    /////////////////////////MAP////////////////////////

    componentWillMount() {
        this.checkLogin();
    }

    toggleModalDetails(event) {
        this.setState({
            showModalDetails: !this.state.showModalDetails
        })
    }

    toggleModalConf(message) {
        this.setState({
            showModalConf: !this.state.showModalConf,
            modalMessageConfirm: message
        })
    }

    convertDate() {
        var date = this.state.info.date;
        var time = this.state.info.time;
        var convert = new Date(`${date} " " ${ time}`);
        var newDate = convert.toLocaleDateString();
        return newDate;
    }

    convertTime() {
        var date = this.state.info.date;
        var time = this.state.info.time;
        var d = new Date(`${date} " " ${ time}`);
        var hr24 = d.getHours();
        var min = d.getMinutes();
        var clock = "AM";
        var hr12 = hr24;
        if (hr12 >= 12) {
          hr12 = hr24 - 12;
          clock = "PM";
        }
        if (hr12 == 0) {
          hr12 = 12;
        }
        min = min < 10 ? "0" + min : min;
      
        var pattern = new RegExp("0?" + hr24 + ":" + min);
      
        var replacement = hr12 + ":" + min;
        replacement += " " + clock;
        return replacement;
    }

    userJoinEvent() {
        const self = this;
        this.props.userJoin(this.state.info).then(function(response){
            if (response.payload.data === 'duplicate') {
                self.toggleModalConf("error1");
            } else if (response.payload.data === 'max') {
                self.toggleModalConf("error2");
            } else if (response.payload.data.success === true) {
                self.toggleModalConf("success");
            }
        }).catch((err) => {
            self.toggleModalConf("error");
        });
    }

    checkLogin() {
        this.props.userAuth().then((resp) => {
            this.setState({
                isLoggedIn: resp.payload.data.isLoggedIn
            })
        }).catch((resp) => {
            console.log("This is the error", resp);
        })
    }

    render() {
        const {info} = this.props;
        const {isLoggedIn} = this.state;
        
        return (
            <div className="col-sm-12 col-xs-12 singleItem">
                <div className="col-sm-12">
                    <h4>Title: {info.title}</h4>
                    <p>Subject: {info.e_s_subj}</p>
                    <p>{`On ${this.convertDate()} at ${this.convertTime()}`}</p>
                </div>
                <div className="col-sm-12 buttonContainer">
                    <button onClick={this.renderMapAfterClick} className="col-sm-4 col-sm-offset-1 col-xs-6 btn btn-primary" type="button">More Info</button>
                    {
                        isLoggedIn ?
                            <button onClick={this.userJoinEvent} className="col-sm-5 col-sm-offset-1 col-xs-6 btn btn-success" type="button">Join Event</button>
                            :
                            null
                    }               
                </div>
                <DetailsModal details={info} showModal={this.state.showModalDetails} toggleModal={this.toggleModalDetails}/>
                <ConfirmationModalJoin confirmStatus={this.state.modalMessageConfirm} showModal={this.state.showModalConf} toggleModal={this.toggleModalConf}/>
            </div>
        );
    }
}

export default connect(null, {userJoin, userAuth})(EventDetails);
