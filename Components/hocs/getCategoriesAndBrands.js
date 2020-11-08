import React from 'react';
import {getBrands, getCategories} from '../../core/apiCore'


export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;
  hocComponent.getInitialProps = async ({product}) => {
    const brands = await getBrands()
    const categories = await getCategories()
    if(WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({brands, categories, product});
      return { ...wrappedProps};
    }
  };
  return hocComponent;
};
