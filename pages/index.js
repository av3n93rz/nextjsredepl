import Head from 'next/head'
import React, {useState, useEffect} from 'react'
import Navbar from '../Components/Navbar'
import ListProducts from '../Components/ListProducts';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Alert from '@material-ui/lab/Alert';
import ProductCard from '../Components/ProductCard'
import Grid from '@material-ui/core/Grid';
import {Container} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

 const Home = ({products, userAuth, page, pages}) => {
  const classes = useStyles();
  console.log(products, userAuth, page, pages)

  return (
    <>
    <Head>
        <title>Home Screen</title>
      </Head>
    <Navbar pageTitle={"Home"} User_name={userAuth && userAuth.name}/>
      <Container maxWidth="lg">
        <h1>Latest Products</h1>
        <Grid container spacing={4} style={{justifyContent:"center"}}>
          {products.map((product)=> (<Grid item><ProductCard key={product.id} product={product}/></Grid>))}
        </Grid>
      </Container>
    </>
  )
}

Home.getInitialProps = async (products) => {
  return products
}

export default ListProducts(Home)