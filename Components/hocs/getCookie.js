import React from 'react';

export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;
  hocComponent.getInitialProps = async ({ req, res}) => {
    let cookie = req.cookies.jwt
    if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({cookie});
      return { ...wrappedProps};
    }
  };
  return hocComponent;
};

