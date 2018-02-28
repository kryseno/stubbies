import React, {Component} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {leaveEvent, allJoinEvent} from '../../actions';
import DetailsModal from '../modal/event_details_modal';

import './eventItemProfile.css';

class EventDetails extends Component {
    constructor (props) {
        super (props);

        this.state = {
            showModal: false,
            info: this.props.info
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.cancelJoinEvent = this.cancelJoinEvent.bind(this);

        this.renderMapAfterClick = this.renderMapAfterClick.bind(this);
        this.singleMap = this.singleMap.bind(this);
        this.axiosThenFunction = this.axiosThenFunction.bind(this);
    }

    /////////////////////////MAP////////////////////////
    renderMapAfterClick(){
        const {info} = this.props;
        axios.post('https://maps.googleapis.com/maps/api/geocode/json?address='+info.location+'&key=AIzaSyBtOIVlRonYB8yoKftnhmhRT_Z8Ef-op3o')
            .then(this.axiosThenFunction);
    }

    axiosThenFunction(response){
        this.setState({
            coordinates: response.data.results[0].geometry.location
        });
        this.toggleModal();
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

    toggleModal(event) {
        this.setState({
            showModal: !this.state.showModal
        })
    }


    cancelJoinEvent() {
        const {info} = this.props;
        var self = this;
        
        this.props.leaveEvent(info).then(function(response){
            self.props.allJoinEvent();
        });
    }

    convertDate() {
        var date = this.state.info.date;
        var time = this.state.info.time;
        var convert = new Date(`${date} " " ${time}`);
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

    render() {
        // console.log('PROPS FOR JOIN EVENT ITEM: ', this.props);
        const {info} = this.props;

        return (
            <div className="col-sm-12 col-xs-12 singleItem">
                <div className="col-sm-12">
                    <h4>Title: {info.title}</h4>
                    <p>Subject: {info.e_s_subj}</p>
                    <p>{`On ${this.convertDate()} at ${this.convertTime()}`}</p>
                </div>
                <div className="col-sm-12 buttonContainer">
                    <button onClick={this.renderMapAfterClick} className="col-sm-4 col-sm-offset-1 col-xs-6 btn btn-primary" type="button">More Info</button>
                    <button onClick={this.cancelJoinEvent} className="col-sm-5 col-sm-offset-1 col-xs-6 btn btn-warning" type="button">Leave Event</button>
                </div>
                <DetailsModal details={info} showModal={this.state.showModal} toggleModal={this.toggleModal}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    joined: state.event.userJoinedEvents
}

export default connect(mapStateToProps, {leaveEvent, allJoinEvent})(EventDetails);
