import React from 'react';
import Router from 'next/router';

const home = '/?redirected=true'; 


export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;
  hocComponent.getInitialProps = async ({ req, res}) => {
    if (req.cookies.jwt) {
      if (res) {
        res?.writeHead(302, {
          Location: home,
        });
        res?.end();
      } else {
        Router.replace(home);
      }
    } else if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps();
      return { ...wrappedProps};
    }

    return {};
  };
  return hocComponent;
};
