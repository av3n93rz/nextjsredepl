import React from 'react';
import {verify} from '../../core/apiCore'

export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;
  hocComponent.getInitialProps = async ({ req, res}) => {
      const hash = req.query.verify_Id ? req.query.verify_Id : false
      let verified
      if(hash){
        verified = await verify(hash)
      }
    if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({verified});
      return { ...wrappedProps};
    }
  };
  return hocComponent;
};

