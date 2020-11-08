import Head from 'next/head'
import React, {useState, useEffect, useRef} from 'react'
import Navbar from '../Components/Navbar'
import ListProducts from '../Components/hocs/ListProducts';
import { makeStyles } from '@material-ui/core/styles';
import ProductCard from '../Components/ProductCard'
import Grid from '@material-ui/core/Grid';
import {Container} from '@material-ui/core';
import BottomNavbar from '../Components/BottomNavbar'


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

 const Search = ({products, userAuth, page, pages}) => {
  const childNav = useRef(null);
  const BottomCart = useRef(null);
  const classes = useStyles();
  const [displayedProducts, setDisplayedProducts] = useState(products)

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
    <Head>
        <title>Home Screen</title>
        <meta name="description" content='Check out our newest products and the catalog.' />
      </Head>
    <Navbar ref={childNav} user={userAuth && userAuth} trigger={searchRequestHandler} passToBottom={passToBottom}/>
      <Container maxWidth="lg">
        <h1>Latest Products</h1>
        <Grid container spacing={4} style={{justifyContent:"center"}}>
          {displayedProducts.map((product)=> (<Grid item key={product._id}><ProductCard product={product} addToCartItems={addToCartItems}/></Grid>))}
        </Grid>
      </Container>
      <BottomNavbar ref={BottomCart} removeFromCartHandler={removeFromCartHandler} clearNavCartState={clearNavCartState}/>
    </>
  )
}

Search.getInitialProps = async (products) => {
  return products
}

export default ListProducts(Search)