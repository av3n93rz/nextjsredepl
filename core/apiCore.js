
const AppUrl = process.env.APP_URL

exports.listProducts = () =>{
  return fetch(`${AppUrl}/api/v1/products`, {
    method: 'GET',
  })
  .then(response =>{
    return response.json()
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.listAdminProducts = (cookie) =>{
  return fetch(`${AppUrl}/api/v1/products/admin`, {
    credentials: 'include',
    method: 'GET',
    headers:{
      jwt:cookie
    }
  })
  .then(response =>{
    return response.json()
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.listUsers = (cookie) =>{
  return fetch(`${AppUrl}/api/v1/users/admin`, {
    credentials: 'include',
    method: 'GET',
    headers:{
      jwt:cookie
    }
  })
  .then(response =>{
    return response.json()
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.getBrands = () =>{
  return fetch(`${AppUrl}/api/v1/brands`, {
    method: 'GET',
  })
  .then(response =>{
    return response.json()
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.getCategories = () =>{
  return fetch(`${AppUrl}/api/v1/categories`, {
    method: 'GET',
  })
  .then(response =>{
    return response.json()
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.getSingleProduct = (id) =>{
  return fetch(`${AppUrl}/api/v1/products/${id}`, {
    method: 'GET',
  })
  .then(response =>{
    return response.json()
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.signin = user =>{
  return fetch(`/api/v1/users/login`, {
    method: 'POST',
    headers:{
      Accept: 'application/json',
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
  .then(response =>{
    console.log(response)
    return response
  })
  .catch(err=>{
    console.log(err)
  })
}

exports.signupApi = user =>{
  return fetch(`/api/v1/users/signup`, {
    method: 'POST',
    headers:{
      Accept: 'application/json',
      "Content-Type": "application/json"
    },
    body: JSON.stringify(user)
  })
  .then(response =>{
    return response.json()
  })
  .catch(err=>{
    console.log(err)
  })
}
