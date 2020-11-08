import React, {useState, useEffect, useRef} from 'react'
import ProductCard from '../../../Components/ProductCard'
import Navbar from '../../../Components/Navbar'
import GetProduct from '../../../Components/hocs/GetProduct'
import Image from 'next/image'
import BottomNavbar from '../../../Components/BottomNavbar'


const Product = ({product, userAuth}) => {
  const childNav = useRef(null);
  const BottomCart = useRef(null);

  const searchRequestHandler = (searchValue, category) => {
    console.log(searchValue, category)
  }

  const addToCartItems = (product) => {
    childNav.current.addToCartItems(product)
  }  

  const passToBottom = (cartItems) =>{
    BottomCart.current.passDownItems(cartItems)
  }

  const removeFromCartHandler = (id) =>{
    childNav.current.removeItemHandler(id)
  }

  const clearNavCartState = () =>{
    childNav.current.clearCart()
  }

  return (
    <>
      <Navbar ref={childNav} user={userAuth && userAuth} trigger={searchRequestHandler} passToBottom={passToBottom}/>
      <h1>ProductPage</h1>
      <ProductCard product={product}/>
      <BottomNavbar ref={BottomCart} removeFromCartHandler={removeFromCartHandler} clearNavCartState={clearNavCartState}/>
    </>
  )
}

Product.getInitialProps = async ({product}) => {
  return {product}
}

export default GetProduct(Product)
