import React, { Fragment } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { isLoggedIn, isAdmin } from '../../logic/auth';

import NavigationBarAndDrawer from '../NavigationBarAndDrawer/NavigationBarAndDrawer';

export const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !isLoggedIn() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/' }} />
        )
      }
    />
  );
};

export const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn() ? (
          <Fragment>
            <NavigationBarAndDrawer />
            <Component {...props} />
          </Fragment>
        ) : (
          <Redirect
            to={{ pathname: '/welcome', state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export const AdminRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAdmin() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    />
  );
};
