import React, { useLayoutEffect, useState, useEffect, forwardRef, useImperativeHandle, useCallback}from 'react';
import {makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Image from 'next/image'
import Divider from '@material-ui/core/Divider';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from '@material-ui/icons/Done';
import {emptyCart} from '../core/cartHandlers'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
  cartItemImageContainer:{
    display: 'flex',
    justifyContent: 'center',
    width: '75px',
    height: '60px'
  },
  cartItemImage:{
    maxHeight: '60px',
    paddingRight: '10px'
  },
  cartItemContainer:{
    width: '361px',
    display: 'flex',
    padding: '8px 16px',
    transition: '0.3s',
    marginLeft:'0px',
    '&:hover':{
      marginLeft:'-60px',
    }
  },
  cartPaper:{
    maxHeight: '266px',
    overflowY:'scroll',
    maxWidth: '300px',
    borderBottomLeftRadius: '0px',
    borderBottomRightRadius: '0px',
    overflowX: 'hidden',
  },
  cartItemTitle:{
    display: 'block',
    display: '-webkit-box',
    maxWidth: '218px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  cartItemDetails:{
    display: 'flex',
    flexDirection: 'column'
  },
  cartItemPrice:{
    display: 'flex',
    justifyContent: 'flex-end',
    '& p':{
      fontWeight: 'bold'
    }
  },
  cartSubtotal:{
    display: 'flex',
    justifyContent: 'space-around',
    padding: '16px',
    '& p':{
      fontWeight: 'bold'
    }
  },
  removeIcon:{
    padding: '0 10px'
  },
  checkout:{
    display: 'flex',
    justifyContent: 'center',
    paddingBottom:'15px'
  },
  checkoutText:{
    fontSize: '0.8rem',
    fontWeight: '600'

  },
  clrCart:{
    paddingBottom: '5px',
    textAlign: 'center',
    fontSize: '0.8rem',
    cursor: 'pointer'
  },
  Paper:{
    [theme.breakpoints.down('smd')]: {
      display: 'none',
    },
  }
}));

const NavbarCart = forwardRef(({cartItems, removeFromCartHandler, clearNavCartState}, ref) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState();
  const [items, setItems] = useState(cartItems)

  console.log(items)

  const updateSize = useCallback(() => {
    if(window.innerWidth <= 750){
      handleClickAway()
    }
  },[])

 const handleToggle = () => {
    if (!open) window.addEventListener('resize', updateSize)
    else window.removeEventListener('resize', updateSize)
  }

  const handleClick = (newPlacement) => (event) => {
    handleToggle()
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  const handleClickAway = () => {
    handleToggle()
    setAnchorEl(null)
    setOpen(false)
    setPlacement()
  };

  useImperativeHandle(
    ref,
    () => ({
      passDownItems(items){
          setItems([...items])
        }
     }),
 )

  const RemoveFromCart = (id) =>{
    removeFromCartHandler(id)
  }

  const clearCartHandler = () =>{
    setItems([])
    emptyCart()
    clearNavCartState([])
  }

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <Button onClick={handleClick('bottom-end')}><ShoppingCartIcon className={classes.secondaryColor} /><Typography variant="subtitle1" component="p" className={classes.secondaryColor}>Cart</Typography></Button>
          {items.length > 0 ? (
            <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={200}>
                <Paper className={classes.Paper}>
                  <div className={classes.cartPaper}>
                    {items.map((item)=>(
                      <>
                        <div key={item.id} className={classes.cartItemContainer}>
                          <div className={classes.cartItemImageContainer}>
                            <Image src={`${item.image}`} priority={true} alt={item.name} unsized={true} className={classes.cartItemImage}/>
                          </div>
                          <div className={classes.cartItemDetails}>
                            <Link href={`/product/id?product=${item.id}`} underline={'none'}>
                              <Typography variant="subtitle2" color="textSecondary" component="p" className={classes.cartItemTitle}>
                                {item.name}
                              </Typography>
                            </Link>
                            <div className={classes.cartItemPrice}>
                              <Typography variant="button" color="textSecondary" component="p">
                                ${item.price}
                              </Typography>
                            </div>
                          </div>
                          <div className={classes.removeIcon}>
                            <IconButton aria-label="remove from cart" onClick={()=>{RemoveFromCart(item)}} >
                              <RemoveShoppingCartIcon />
                            </IconButton>
                          </div>
                        </div>
                        <Divider variant="middle"/>
                      </>
                    ))}
                  </div>
                  <div>
                    <div className={classes.cartSubtotal}>
                      <Typography variant="button" color="textSecondary" component="p">
                        {`Subtotal(${items.length} items):`}
                      </Typography>
                      <Typography variant="button" color="textSecondary" component="p">
                        ${items.reduce((a, b)=> ({price: a.price + b.price})).price.toFixed(2)}
                      </Typography>
                    </div>
                    <div className={classes.checkout}>
                      <Link href={`/checkout`} underline={'none'}>
                        <Button variant="contained" color='primary'><DoneIcon color='secondary'/><Typography variant="h6" component="p" color='secondary' className={classes.checkoutText} >Proceed to Checkout</Typography></Button>
                      </Link>
                    </div>
                    <Typography onClick={clearCartHandler} variant="caption text" color="textSecondary" component="p" className={classes.clrCart}>
                      Clear cart
                    </Typography>
                  </div>
                </Paper>
              </Fade>
            )}
          </Popper>
          ):(
            <Popper open={open} anchorEl={anchorEl} placement={placement} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={200}>
                <Paper className={classes.Paper}>
                  <Typography variant="button" color="textSecondary" component="p"className={classes.typography} >
                    Your cart is empty
                  </Typography>
                </Paper>
              </Fade>
            )}
          </Popper>
          )}
        </div>
      </ClickAwayListener>
    </>   
  );
})

export default NavbarCart