import React from 'react';
import {getSingleProduct} from '../../core/apiCore'


export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;

  hocComponent.getInitialProps = async ({ req, productId}) => {
    let product
    if(productId){
      product = await getSingleProduct (productId)
    } else {
      product = await getSingleProduct (req.query.product)
    }
    const wrappedProps = await WrappedComponent.getInitialProps({product});
    return { ...wrappedProps};
  };
  return hocComponent;
};
