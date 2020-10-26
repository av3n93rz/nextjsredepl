import React from 'react'
import ProductCard from '../../../Components/ProductCard'
import Navbar from '../../../Components/Navbar'
import GetProduct from '../../../Components/GetProduct'


const Product = (props) => {
  const {product, userAuth} = props

  return (
    <>
      <Navbar pageTitle={"Product"} User_name={userAuth && userAuth.name}/>
      <h1>ProductPage</h1>
      <ProductCard product={product}/>
    </>
  )
}

Product.getInitialProps = async (product) => {
  return {product}
}

export default GetProduct(Product)
