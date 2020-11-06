import React from 'react'
import ProductCard from '../../../Components/ProductCard'
import Navbar from '../../../Components/Navbar'
import GetProduct from '../../../Components/hocs/GetProduct'
import Image from 'next/image'


const Product = (props) => {
  const {product, userAuth} = props

  return (
    <>
      <Navbar pageTitle={"Product"} User_name={userAuth && userAuth.name}/>
      <h1>ProductPage</h1>
      <ProductCard product={product}/>
      
      <Image src={`${product.image[0]}`} unsized={true} quality={100}/>
    </>
  )
}

Product.getInitialProps = async (product) => {
  return {product}
}

export default GetProduct(Product)
