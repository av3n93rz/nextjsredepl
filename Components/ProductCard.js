import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RatingComp from './Rating'
import Link from '@material-ui/core/Link';
import Image from 'next/image'
import {AddToCart} from '../core/cartHandlers'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 250,
    '& > div > div':{
      justifyContent: 'center'
    }
  },
  media: {
    height: '200px',
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
  cardTitle:{
    display: 'block',
    display: '-webkit-box',
    fontSize: '1rem',
    paddingBottom: '5px',
    maxWidth: '218px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  description:{
    display: 'block',
    display: '-webkit-box',
    maxWidth: '218px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitLineClamp: 4,
    WebkitBoxOrient: 'vertical'
  },
  ImageContainer:{
    maxHeight: '200px',
    maxWidth: '-webkit-fill-available',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    padding: '10px'
  },
  ContentContainer:{
    padding: '16px 16px 0px 16px',
    height: '147px'
  },
  imgContainer:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '200px',
  }
}));

const ProductCard = ({product, addToCartItems}) => {
  const classes = useStyles();

  console.log(product)

  const AddToCartHandler = () =>{
    AddToCart(product)
    addToCartItems({
      id:product._id,
      name: product.name,
      image:product.image[0],
      price:product.price,
      count: 1
    })
  }

  return (<Card className={classes.root}>
    <div className={classes.imgContainer}>
      <Image src={`${product.image[0].url}`} alt={product.name} unsized={true} className={classes.ImageContainer}/>
    </div>
    <CardContent className={classes.ContentContainer}>
      <Link href={`/product/id?product=${product._id}`}>
        <Typography variant="h6" color="textSecondary" component="p" className={classes.cardTitle}>
          {product.name}
        </Typography>
      </Link>
      <Typography variant="caption" color="textSecondary" component="p" className={classes.description}>
        {product.description}
      </Typography>
    </CardContent>
    <RatingComp rate={product.rating} />
    <CardActions disableSpacing>
      <Typography variant="h6" color="textSecondary" component="p" style={{marginLeft:'10px', marginRight:'auto'}}>
        ${product.price}
      </Typography>
      <div style={{marginRight:'0px'}}>
        <IconButton aria-label="Add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="Add to cart" onClick={AddToCartHandler}>
          <AddShoppingCartIcon />
        </IconButton>
      </div>
    </CardActions>
  </Card>
  )
}

export default ProductCard
