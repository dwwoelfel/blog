import {match, browserHistory, Router} from 'react-router';
import {Provider} from 'react-redux';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';


match({history: browserHistory, routes}, (err, redirect, props) => {
  ReactDOM.render(
    <Router
      onUpdate={() => window.scrollTo(0, 0)}
      {...props}
    />,
    document.getElementById('react-root'),
  );
});
