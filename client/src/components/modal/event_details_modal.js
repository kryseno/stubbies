import React, {Component} from 'react';

import './event_details_modal.css';

class DetailsModal extends Component {
    constructor (props) {
        super(props);

        this.state = {
            showModal: this.props.showModal,
            details: this.props.details
        }

        this.toggleModal = this.props.toggleModal; /*passed by prop*/
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            showModal: nextProps.showModal
        })
    }

    convertDate() {
        var date = this.state.details.date;
        var time = this.state.details.time;
        var convert = new Date(`${date} " " ${ time}`);
        var newDate = convert.toLocaleDateString();
        return newDate;
    }

    convertTime() {
        var date = this.state.details.date;
        var time = this.state.details.time;
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
        const {showModal, details} = this.state;
        if(!showModal){
            return null;
        }

        return (
            <div className={`modal detailsModal ${showModal ? '' : ' hidden'}`} role="dialog">
                <div className="modal-dialog detailsDialog">
                    <div className="modal-content detailsContent">
                        <div className="modal-header">
                            <button onClick={this.toggleModal} type="button" className="close">&times;</button>
                            <h4 className="modal-title">{`Details: ${details.title}`}</h4>
                        </div>
                        <div className="modal-body detailsBody col-sm-12">
                            <div className="col-sm-6 col-xs-12">
                                <p><b>Subject: </b>{details.e_s_subj}</p>
                                <p><b>Max Group Size: </b>{details.max}</p>
                                <p><b>Date of Event: </b>{this.convertDate()}</p>
                                <p><b>Time of Event: </b>{this.convertTime()}</p>
                                <p><b>Duration of Event: </b>{details.duration}</p>
                                <p><b>Contact Phone: </b>{details.phone}</p>
                                <p><b>Contact Email: </b>{details.email}</p>
                                <p><b>Description: </b>{details.description}</p>
                                <p><b>Location: </b>{details.location}</p>
                            </div>

                            <div className="singleMap col-sm-6 col-xs-12" id="singleMap"></div>
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

export default DetailsModal;
