import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import promise from 'redux-promise';
import rootReducer from './reducers';
import {BrowserRouter as Router} from 'react-router-dom';

import App from './components/app';
import './index.css';

ReactDOM.render(
    <Provider store={createStore(rootReducer, {}, applyMiddleware(promise))}>
        <Router>
            <App/>
        </Router>
    </Provider>,
    document.getElementById('root')
);
