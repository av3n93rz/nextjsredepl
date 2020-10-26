import React from 'react';
import {getSingleProduct} from '../core/apiCore'


export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

  hocComponent.getInitialProps = async ({ req, res }) => {
    const product = await getSingleProduct (req.query.product)
    const wrappedProps = await WrappedComponent.getInitialProps(product);
    return { ...wrappedProps};
  };
  return hocComponent;
};
