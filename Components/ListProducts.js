import React from 'react';
import {listProducts} from '../core/apiCore'

export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;
  hocComponent.getInitialProps = async ({ req, res}) => {
    const products = await listProducts()
    if(WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps(products);
      return { ...wrappedProps};
    }
  };
  return hocComponent;
};

