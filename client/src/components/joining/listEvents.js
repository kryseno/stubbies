import React, {Component} from 'react';
import {connect} from 'react-redux';
import EventDetails from './eventItem';

const listDiv = {
    overflowY: 'auto',
    height: '85vmin',
    /* border: '1px dashed lightcoral' */
}

class EventList extends Component {
    constructor (props) {
        super (props);
    }


    render() {
        if (this.props.filterValues.length > 0) {
            const arrayCheck = this.props.events;
            if (arrayCheck.length !== 0) {
                const acceptedValues = [];
                const eventArray = this.props.events.data;
                for (var f = 0; f < this.props.filterValues.length; f++) {
                    for (var i = 0; i < eventArray.length; i++) {
                        if (eventArray[i].e_s_subj === this.props.filterValues[f]) {
                            acceptedValues.push(eventArray[i]);
                        }
                    }
                }
                if (acceptedValues.length > 0) {
                    const map = new google.maps.Map(document.getElementById('joinMap'), {
                        zoom: 10,
                        center: this.props.zipcodeCoords
                    });

                    for (var i = 0; i < acceptedValues.length; i++) {
                        const contentString = '</div>'+
                        '<h5><u>'+acceptedValues[i].title+'</u></h5>'+
                        '<p>Location: '+acceptedValues[i].location+'</p>'+
                        '<p>Subject: '+acceptedValues[i].e_s_subj+'</p>'+
                        '<p>Max Group Size: '+acceptedValues[i].max+'</p>'+
                        '<p>Date of Event: '+acceptedValues[i].date+'</p>'+
                        '<p>Time of Event: '+acceptedValues[i].time+'</p>'+
                        '<p>Duration of Event: '+acceptedValues[i].duration+'</p>'+
                        '<p>Contact Phone: '+acceptedValues[i].phone+'</p>'+
                        '<p>Contact Email: '+acceptedValues[i].email+'</p>'+
                        '<p>Description: '+acceptedValues[i].description+'</p>'+
                        '</div>';
                        const infoWindow = new google.maps.InfoWindow({
                            content: contentString
                        });

                        const latLng = JSON.parse(acceptedValues[i].coordinates);
                        const marker = new google.maps.Marker({
                            position: latLng,
                            map: map
                        });

                        marker.addListener('click', function() {
                            infoWindow.open(map, marker);
                        });

                        map.addListener('click', function() {
                            infoWindow.close();
                        });
                    }
                    const eventElements = acceptedValues.map((eventItem, index) => {
                        return <EventDetails key={index} info={eventItem}/>
                    });
                    return (
                        <div style={listDiv}>
                            <ul style={{padding: 0}}>
                                {eventElements}
                            </ul>
                        </div>
                    )
                } else {
                    return (
                        <div>
                            <h3>No Events Match Filtered Values</h3>
                        </div>
                    )
                }
            }
        } else {
            const arrayCheck = this.props.events;
            if (arrayCheck.length !== 0) {
                const eventArray = this.props.events.data;
                const eventElements = eventArray.map((eventItem, index) => {
                    return <EventDetails key={index} info={eventItem}/>
                });
                return (
                    <div style={listDiv}>
                        <ul style={{padding: 0}}>
                            {eventElements}
                        </ul>
                    </div>
                )
            } else {
                return (
                    <div>No events found</div>
                )
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        events: state.event.all
    }
}

export default connect(mapStateToProps)(EventList);
