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
import axios from 'axios'
import Pagination from '@material-ui/lab/Pagination';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    backgroundColor: theme.palette.secondary.dark,
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
      top: '420px',
      textAlign: 'center',
    },
    [theme.breakpoints.down('smd')]: {
      top: '425px',
      fontSize: '2.5rem',
      lineHeight: '35px',
    },
  },
  slider:{
    overflowX: 'hidden'
  },
  mainContainer:{
    marginBottom: '125px'
  },
  pagination:{
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '15px',
    marginTop: '15px'
  }
}));

 const Home = ({products, userAuth, page, pages}) => {
  const childNav = useRef(null);
  const BottomCart = useRef(null);
  const classes = useStyles();
  const [displayedProducts, setDisplayedProducts] = useState(products)
  const [currentPage, setCurrentPage] = useState(page)
  const [firstLoad, setFirstLoad] = useState(true)
  const [loadingContent, setLoadingContent] = useState(false)
  const [favorites, setFavorites] = useState(userAuth && userAuth.favorites || [])


  useEffect(()=>{
    setDisplayedProducts([...displayedProducts])
  }, [favorites])

  useEffect(()=>{
    if(!firstLoad){
      const getPageProducts = async() =>{
        try {
          const data = await axios.get(`/api/v1/products?pageNumber=${currentPage}`)
          if(data.status === 200){
            setDisplayedProducts([...data.data.products])
            setLoadingContent(false)
            if(screen.availHeight > screen.availWidth){
              document.getElementById('top_pagination').scrollIntoView({block:'center'})
            } else {
              window.scrollTo({
                top: 0,
                behavior: "auto"
              });
            }
          }
          return
        } catch (error) {
          console.error(error)
        }
      }
      getPageProducts()
    }
  }, [currentPage])

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

  const toggleFavorites = async(id) =>{
    const setFavs_db = async(typeOfAction) =>{
      try {
        const config = {
          headers: {
            'Content-Type':'application/json',
          }
        }
        const {status} = await axios.post(`/api/v1/users/favorites/${userAuth._id}`, { itemId:id, TOA: typeOfAction}, config)
        return status
        } catch (error) {
          console.error(error)
        }
    }
    let index = favorites.indexOf(id)
    if( index < 0){
      let dbstatus = await setFavs_db(true)
      if(dbstatus === 200){
        setFavorites([...favorites, id])
      }
    } else {
      let dbstatus = await setFavs_db(false)
      if(dbstatus === 200){
        setFavorites([...favorites.slice(0, index), ...favorites.slice(index+1)])
      }
    }
  }

  const handlePages = (event, value) =>{
    if(value !== currentPage){
      setLoadingContent(true)
      setDisplayedProducts([])
      setFirstLoad(false)
      setCurrentPage(value)
    }
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
          <Typography variant="h6" component="p" className={classes.slideTitle}>{products[11].name}</Typography>
          <div className={classes.imgContainer}>
            <Image src={`${products[11].image[0].url}`} priority={true} alt={products[11].name} unsized={true} className={classes.SlideImg}/>
          </div>
        </div>
        <div className={classes.slide2}>
        <Typography variant="h6" component="p" className={classes.slideTitle}>{products[2].name}</Typography>
          <div className={classes.imgContainer}>
            <Image src={`${products[2].image[0].url}`} priority={true} alt={products[2].name} unsized={true} className={classes.SlideImg}/>
          </div>
        </div>
      </Slider>
      <Container maxWidth="lg" className={classes.mainContainer}>
        <Pagination id='top_pagination' count={pages} page={currentPage} onChange={handlePages} className={classes.pagination}/>
        {loadingContent && <div className={classes.pagination}><CircularProgress color="secondary"/></div>}
        <Grid container spacing={4} style={{justifyContent:"center"}}>
          {displayedProducts.map((product)=> (<Grid item key={product._id}><ProductCard product={product} isFavorite={favorites.indexOf(product._id) < 0 ? false:true} addToCartItems={addToCartItems} toggleFavorites={toggleFavorites}/></Grid>))}
        </Grid>
        {!loadingContent && <Pagination count={pages} page={currentPage} onChange={handlePages} className={classes.pagination}/>}
      </Container>
      <BottomNavbar ref={BottomCart} removeFromCartHandler={removeFromCartHandler} clearNavCartState={clearNavCartState}/>
    </>
  )
}

Home.getInitialProps = async (products) => {
  return products
}

export default ListProducts(Home)