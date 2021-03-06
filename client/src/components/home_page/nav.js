import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import FacebookLogin from './fbLogin';
import ProfileToggle from './profile_toggle';
import JoinToggle from './join_toggle';


import './nav.css';
import Logo from '../../assets/images/logo.png';

class Nav extends Component {
    constructor (props) {
        super (props);

        this.burgerToggle = this.burgerToggle.bind(this);
    }

    burgerToggle() {
        let linksEl = document.querySelector('.narrowLinks');

        if (linksEl.style.display === 'block') {
            linksEl.style.display = 'none';
        } else {
            linksEl.style.display = 'block';
        }
    }
    render() {
        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="navWide"> {/* navbar for larger device screens */}
                        <div className="navbar-header">
                            <div className="headerName">
                                <span className="letter" data-letter="S">S</span>
                                <span className="letter" data-letter="T">T</span>
                                <span className="letter" data-letter="U">U</span>
                                <span className="letter" data-letter="B">B</span>
                                <span className="letter" data-letter="B">B</span>
                                <span className="letter" data-letter="I">I</span>
                                <span className="letter" data-letter="E">E</span>
                                <span className="letter" data-letter="S">S</span>
                            </div>
                        </div>
                        <div className="wideNav">
                            <ul className="nav nav-tabs navbar-right">
                                <li>
                                    <Link to='/'>Home</Link>
                                </li>
                                <li>
                                    <ProfileToggle />
                                </li>
                                <li>
                                    <JoinToggle />
                                </li>
                                <li>
                                    <Link to='/create-event'>Create Event</Link>
                                </li>
                                <li className="facebookLogin">
                                    <FacebookLogin />
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="navNarrow"> {/* navbar for smaller device screens*/}
                        <i onClick={this.burgerToggle} className="fa fa-bars fa-2x burgerToggle" role="button"></i>
                        <div className="navbar-header">
                            <div className="headerName">
                                <span className="letter" data-letter="S">S</span>
                                <span className="letter" data-letter="T">T</span>
                                <span className="letter" data-letter="U">U</span>
                                <span className="letter" data-letter="B">B</span>
                                <span className="letter" data-letter="B">B</span>
                                <span className="letter" data-letter="I">I</span>
                                <span className="letter" data-letter="E">E</span>
                                <span className="letter" data-letter="S">S</span>
                            </div>
                        </div>
                        <div className="narrowLinks">
                            <ul className="nav">
                                <li className="otherLinks" onClick={this.burgerToggle}>
                                    <Link to='/'>Home</Link>
                                </li>
                                <li className="otherLinks" onClick={this.burgerToggle}>
                                    <ProfileToggle />
                                </li>
                                <li className="otherLinks" onClick={this.burgerToggle}>
                                    <JoinToggle />
                                </li>
                                <li className="otherLinks" onClick={this.burgerToggle}>
                                    <Link to='/create-event'>Create</Link>
                                </li>
                                <li className="facebookLogin" onClick={this.burgerToggle}>
                                    <FacebookLogin />
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
    
}

export default Nav;
