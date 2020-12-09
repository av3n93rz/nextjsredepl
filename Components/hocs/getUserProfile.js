import React from 'react';
import {getUserProfile} from '../../core/apiCore'

export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;
  hocComponent.getInitialProps = async ({cookie, userId}) => {
    const user = await getUserProfile(userId, cookie)
    if(WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps(user);
      return { ...wrappedProps};
    }
  };
  return hocComponent;
};

