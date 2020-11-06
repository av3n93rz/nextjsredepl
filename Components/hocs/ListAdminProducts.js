import React from 'react';
import {listAdminProducts} from '../../core/apiCore'

export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;
  hocComponent.getInitialProps = async ({cookie}) => {
    const products = await listAdminProducts(cookie)
    if(WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps(products);
      return { ...wrappedProps};
    }
  };
  return hocComponent;
};

