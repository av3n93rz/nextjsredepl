import React from 'react';
import {listAdminOrders} from '../../core/apiCore'
import {listStatusValues} from '../../core/apiCore'

export default WrappedComponent => {
  const hocComponent = ({ ...props }) => <WrappedComponent {...props} />;
  hocComponent.getInitialProps = async ({cookie}) => {
    const orders = await listAdminOrders(cookie)
    const statusValues = await listStatusValues(cookie)
    if(WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps(orders, statusValues);
      return { ...wrappedProps};
    }
  };
  return hocComponent;
};

