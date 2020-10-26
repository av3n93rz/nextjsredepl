
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
  console.log(user, 'aaaaaa')
  return fetch(`/api/v1/users/login`, {
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