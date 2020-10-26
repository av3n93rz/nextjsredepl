import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import RatingComp from './Rating'
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 250,
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
    fontSize: '1rem',
    paddingBottom: '5px'
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
  ContentContainer:{
    padding: '16px 16px 0px 16px',
  }
}));

const ProductCard = ({product}) => {

  const classes = useStyles();


  return (<Card className={classes.root}>
    <CardMedia
      className={classes.media}
      image={`${product.image}`}
      title="Paella dish"
    />
    <CardContent className={classes.ContentContainer}>
      <Link href={`/product/id?product=${product._id}`}>
        <Typography variant="h6" color="textSecondary" component="h3" className={classes.cardTitle}>
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
        <IconButton aria-label="Add to cart">
          <AddShoppingCartIcon />
        </IconButton>
      </div>
    </CardActions>
  </Card>
  )
}

export default ProductCard
