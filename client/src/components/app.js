import React from 'react';
import {Route} from 'react-router-dom';

import Nav from './home_page/nav'; 
import Home from './home_page/home';
import Join from './joining/joinEvent';
import Create from './creating/createEvent';
import Profile from './profile/profile';

const App = () => (
    <div className='container'>
        <Nav/>
        <Route exact path="/" component={Home}/>
        <Route path="/join-event" component={Join}/>
        <Route path="/create-event" component={Create}/>
        <Route path="/profile" component={Profile}/>
    </div>
);

export default App;
