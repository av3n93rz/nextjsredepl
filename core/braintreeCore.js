const getBraintreeClientToken = (jwt) =>{
  return fetch(`/api/v1/braintree/getToken/`, {
    method: 'GET',
    headers:{
      Accept: 'application/json',
      "Content-Type": "application/json",
      jwt:jwt
    },
  })
  .then(response =>{
    return response.json()
  })
  .catch(err=>{
    console.log(err)
  })
};

const processPayment = (jwt, paymentData) =>{
  return fetch(`/api/v1/braintree/payment/`, {
    method: 'POST',
    headers:{
      Accept: 'application/json',
      "Content-Type": "application/json",
      jwt:jwt
    },
    body: JSON.stringify(paymentData)
  })
  .then(response =>{
    return response.json()
  })
  .catch(err=>{
    console.log(err)
  })
};

export {getBraintreeClientToken, processPayment}