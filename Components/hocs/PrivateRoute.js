import React from 'react';
import Router from 'next/router';
import {isLoggedIn} from '../../backend/Controllers/authController'

const login = '/login?redirected=true'; 

const checkUserAuthentication = async (jwt_token) => {
  const loggedInUser = await isLoggedIn(jwt_token)
  return loggedInUser
};

export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;
  hocComponent.getInitialProps = async ({ req, res}) => {
    let user
    let userAuth
    let cookie
    if(req.cookies.jwt){
      cookie = req.cookies.jwt
      user = await checkUserAuthentication(req.cookies.jwt);
      if(!user.isAdmin){
        userAuth = {
          error: 'Not an Admin!'
        }
      } else {
        userAuth = user
      }
    } else {
      userAuth = {
        error: 'Not an Admin!'
      }
    }
    
    if (userAuth.error) {
      if (res) {
        res?.writeHead(302, {
          Location: login,
        });
        res?.end();
      } else {
        Router.replace(login);
      }
    } else if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({cookie});
      return { ...wrappedProps};
    }

    return {};
  };
  return hocComponent;
};
