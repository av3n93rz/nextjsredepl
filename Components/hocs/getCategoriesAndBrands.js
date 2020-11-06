import React from 'react';
import {getBrands, getCategories} from '../../core/apiCore'


export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;
  hocComponent.getInitialProps = async () => {
    const brands = await getBrands()
    const categories = await getCategories()
    if(WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps({brands, categories});
      return { ...wrappedProps};
    }
  };
  return hocComponent;
};
