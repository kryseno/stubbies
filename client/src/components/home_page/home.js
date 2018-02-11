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
                <div className="container-fluid banner">
                    <img src={Logo}/>
                    <h2>You don't have to study lonely, with stubbies!</h2>
                </div>

                <div className="about col-sm-8 col-xs-12">
                    <h1>Get Started</h1>
                    <hr/>
                    <p>Find others who are studying the same subject as you and meet up with them with just a few easy clicks!</p>
                    <p>Click <b>Create Event</b> to create an event that others can join.</p>
                    <p>Click <b>Join Event</b> to browse through all the events to find the one you want</p>
                    <p><b>Warning</b>: must be signed in to create or join an event!</p>
                </div>

                <div className="info col-sm-4 col-xs-12">
                    <h1>GitHub Links<i className="devicon-github-plain"></i></h1>
                    <hr style={{borderTop: '1px solid black'}}/>
                    <div className="col-sm-12 col-xs-12 indiv">
                        <Link to="https://github.com/maen003" target="_blank">Michael: Backend</Link>
                    </div>
                    <div className="col-sm-12 col-xs-12 indiv">
                        <Link to="https://github.com/kryseno" target="_blank">Krystal: Backend</Link>
                    </div>
                    <div className="col-sm-12 col-xs-12 indiv">
                        <Link to="https://github.com/pk316" target="_blank">Prosith: Frontend</Link>
                    </div>
                    <div className="col-sm-12 col-xs-12 indiv">
                        <Link to="https://github.com/ericyoon1" target="_blank">Eric: Frontend</Link>
                    </div>
                    <div className="col-sm-12 col-xs-12 indiv">
                        <Link to="https://github.com/oowretep" target="_blank">Peter: Frontend</Link>
                    </div>
                </div>

                {/*<div className="info col-sm-4 col-xs-12">*/}
                    {/*<h2>Tech Stack</h2>*/}
                    {/*<hr style={{borderTop: '1px solid black'}}/>*/}
                    {/*<div>*/}
                        {/*<div className="col-sm-12 techCategory">*/}
                            {/*<h4>Front End</h4>*/}
                            {/*<ul className="listTech">*/}
                                {/*<li className="col-sm-3 col-xs-3">*/}
                                    {/*<i className="deviconicon devicon-react-original colored"></i>*/}
                                    {/*<br/>React.JS*/}
                                {/*</li>*/}
                                {/*<li className="col-sm-3 col-xs-3">*/}
                                    {/*<i className="deviconicon devicon-css3-plain colored"></i>*/}
                                    {/*<br/>CSS3*/}
                                {/*</li>*/}
                                {/*<li className="col-sm-3 col-xs-3">*/}
                                    {/*<i className="deviconicon devicon-bootstrap-plain colored"></i>*/}
                                    {/*<br/>Boostrap*/}
                                {/*</li>*/}
                                {/*<li className="col-sm-3 col-xs-3">*/}
                                    {/*<i className="deviconicon devicon-javascript-plain colored"></i>*/}
                                    {/*<br/>JavaScript*/}
                                {/*</li>*/}
                            {/*</ul>*/}
                        {/*</div>*/}
                        {/*<div className="col-sm-12 techCategory">*/}
                            {/*<h4>Back End</h4>*/}
                            {/*<ul className="listTech">*/}
                                {/*<li className="col-sm-3 col-xs-3">*/}
                                    {/*<i className="deviconicon devicon-nodejs-plain colored"></i>*/}
                                    {/*<br/>Node.JS*/}
                                {/*</li>*/}
                                {/*<li className="col-sm-3 col-xs-3">*/}
                                    {/*<i className="deviconicon devicon-mysql-plain colored"></i>*/}
                                    {/*<br/>MySql*/}
                                {/*</li>*/}
                                {/*<li className="col-sm-3 col-xs-3">*/}
                                    {/*<i className="deviconicon devicon-express-original"></i>*/}
                                    {/*<br/>Express*/}
                                {/*</li>*/}
                                {/*<li className="col-sm-3 col-xs-3">*/}
                                    {/*<img className="passport" src={Passport}/>*/}
                                    {/*<br/>Passport*/}
                                {/*</li>*/}
                            {/*</ul>*/}
                        {/*</div>*/}
                        {/*<div className="col-sm-12 techCategory">*/}
                            {/*<h4>Misc</h4>*/}
                            {/*<ul className="listTech">*/}
                                {/*<li className="col-sm-3 col-xs-3">*/}
                                    {/*<img className="meistertask" src={MeisterTask}/>*/}
                                    {/*<br/>MeisterTask*/}
                                {/*</li>*/}
                                {/*<li className="col-sm-3 col-xs-3">*/}
                                    {/*<i className="deviconicon devicon-git-plain colored"></i>*/}
                                    {/*<br/>Git*/}
                                {/*</li>*/}
                                {/*<li className="col-sm-3 col-xs-3">*/}
                                    {/*<i className="deviconicon devicon-github-plain colored"></i>*/}
                                    {/*<br/>GitHub*/}
                                {/*</li>*/}
                                {/*<li className="col-sm-3 col-xs-3">*/}
                                    {/*<i className="deviconicon devicon-slack-plain colored"></i>*/}
                                    {/*<br/>Slack*/}
                                {/*</li>*/}
                            {/*</ul>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}
            </div>
        )
    }
}

export default Home;