import React from 'react';
import {listUsers} from '../../core/apiCore'

export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;
  hocComponent.getInitialProps = async ({cookie}) => {
    const users = await listUsers(cookie)
    if(WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps(users);
      return { ...wrappedProps};
    }
  };
  return hocComponent;
};

