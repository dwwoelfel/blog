import {App, PostIndex, PostShow} from './components';
import Relay, {isContainer, RootContainer} from 'react-relay';
import {match, browserHistory, Router, Route, IndexRoute} from 'react-router';
import {Provider} from 'react-redux';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

const ViewerQuery = {
  viewer(Component) {
    return Relay.QL`
      query {
        viewer {
          ${Component.getFragment('viewer')}
        }
      }
    `;
  },
};

const PostQuery = {
  post(Component) {
    return Relay.QL`
      query {
        post {
          ${Component.getFragment('post')}
        }
      }
    `;
  },
};


const routes =  (
  <Route path="/" component={App}>
    <IndexRoute
      name="posts-index"
      component={PostIndex}
      queries={ViewerQuery}
    />
    <Route
      name="posts-index"
      path="page/:page"
      component={PostIndex}
      queries={ViewerQuery}
    />
    <Route
      name="post-show"
      path="post/:post"
      component={PostShow}
      queries={PostQuery}
    />
  </Route>
);

export function useRelay(Component, props) {
  if (!isContainer(Component)) return <Component {...props} />
  const {params, route} = props;
  const {name, queries} = route;
  return (
    <RootContainer
      Component={Component}
      renderFetched={
        (data) => <Component {...props} {...data} />
      }
      route={{name, params, queries}}
    />
  );
}

match({history: browserHistory, routes}, (err, redirect, props) => {
  ReactDOM.render(
    <Router
      createElement={useRelay}
      onUpdate={() => window.scrollTo(0, 0)}
      {...props}
    />,
    document.getElementById('react-root'),
  );
});
