import Head from 'next/head'
import React, {useState, useEffect, useRef} from 'react'
import Navbar from '../Components/Navbar'
import ListProducts from '../Components/hocs/ListProducts';
import { makeStyles } from '@material-ui/core/styles';
import ProductCard from '../Components/ProductCard'
import Grid from '@material-ui/core/Grid';
import {Container} from '@material-ui/core';
import BottomNavbar from '../Components/BottomNavbar'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'
import Image from 'next/image'
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  slide1:{
    backgroundColor: theme.palette.primary.light,
    height: '450px',
    display: 'flex !important',
    position: 'relative',
    [theme.breakpoints.down('mdl')]: {
      height: '550px'
    },
    [theme.breakpoints.down('smd')]: {
    height: '600px',
    },
  },
  slide2:{
    backgroundColor: theme.palette.secondary.light,
    height: '450px',
    display: 'flex !important',
    position: 'relative',
    [theme.breakpoints.down('mdl')]: {
      height: '550px'
    },
    [theme.breakpoints.down('smd')]: {
    height: '600px',
    },
  },
  imgContainer:{
    maxHeight: '400px',
    position: 'absolute',
    right: '50%',
    [theme.breakpoints.down('mdl')]: {
      transform: 'translateX(50%)'
    },
    [theme.breakpoints.down('smd')]: {
      
    },
  },
  SlideImg:{
    maxHeight: '500px',
    [theme.breakpoints.down('smd')]: {
    },
  },
  slideTitle:{
    fontSize: '3rem',
    fontWeight: '600',
    color: '#fff',
    position: 'absolute',
    top: '150px',
    left: '50%',
    letterSpacing: '-3px',
    [theme.breakpoints.down('mdl')]: {
      transform: 'translateX(-50%)',
      lineHeight: '50px',
      top: '400px',
      textAlign: 'center',
    },
    [theme.breakpoints.down('smd')]: {
      top: '400px',
      fontSize: '2.5rem',
      lineHeight: '35px',
    },
  },
  slider:{
    overflowX: 'hidden'
  },
  mainContainer:{
    marginBottom: '125px'
  }
}));

 const Home = ({products, userAuth, page, pages}) => {
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
      <Slider className={classes.slider}>
        <div className={classes.slide1}>
          <Typography variant="h6" component="p" className={classes.slideTitle}>{products[14].name}</Typography>
          <div className={classes.imgContainer}>
            <Image src={`${products[14].image[0].url}`} alt={products[14].name} unsized={true} className={classes.SlideImg}/>
          </div>
        </div>
        <div className={classes.slide2}>
        <Typography variant="h6" component="p" className={classes.slideTitle}>{products[24].name}</Typography>
          <div className={classes.imgContainer}>
            <Image src={`${products[24].image[0].url}`} alt={products[24].name} unsized={true} className={classes.SlideImg}/>
          </div>
        </div>
      </Slider>
      <Container maxWidth="lg" className={classes.mainContainer}>
        <h1>Latest Products</h1>
        <Grid container spacing={4} style={{justifyContent:"center"}}>
          {displayedProducts.map((product)=> (<Grid item key={product._id}><ProductCard product={product} addToCartItems={addToCartItems}/></Grid>))}
        </Grid>
      </Container>
      <BottomNavbar ref={BottomCart} removeFromCartHandler={removeFromCartHandler} clearNavCartState={clearNavCartState}/>
    </>
  )
}

Home.getInitialProps = async (products) => {
  return products
}

export default ListProducts(Home)