import React, {useState, forwardRef, useImperativeHandle}from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Image from 'next/image'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';
import {emptyCart} from '../core/cartHandlers'


const BottomNavar = forwardRef(({removeFromCartHandler, clearNavCartState}, BottomCart) => {
  const [items, setItems] = useState([])
  const [cartOpen, setCartOpen] = useState(false);
  const useStyles = makeStyles((theme) => ({
    grow: {
      flexGrow: 1,
    },
    fabButton: {
      position: 'absolute',
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: '0 auto',
    },
    BottomBar:{
      transition: 'boxShadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
      width: '100%',
      zIndex: '1100',
      boxSizing: 'border-box',
      flexShrink: '0',
      flexDirection: 'column',
      left: 'auto',
      right: '0',
      position: 'fixed',
      color: '#fff',
      backgroundColor: theme.palette.secondary.main,
      top: 'auto',
      bottom: '0',
      display: 'block',
      height: '400px',
      marginBottom: cartOpen === true ? items.length > 0 ? '0px':'-300px':'-350px',
      transition: cartOpen === true ? 'margin-bottom 0.15s ease-in':'margin-bottom 0.15s ease-out',
      [theme.breakpoints.up('smd')]: {
        display: 'none',
      },
    },
    priceContainer:{
      top: '9px',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 50px',
      position: 'absolute'
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
      marginLeft:'0px',
    },
    cartItemTitle:{
      display: 'block',
      display: '-webkit-box',
      width: '156px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    },
    cartItemDetails:{
      display: 'flex',
      flexDirection: 'column',
      width: '156px'
    },
    cartItemPrice:{
      display: 'flex',
      justifyContent: 'flex-end',
      '& p':{
        fontWeight: 'bold'
      }
    },
    cartPaper:{
      maxHeight: '216px',
      overflowY:'auto',
      maxWidth: '320px',
      borderBottomLeftRadius: '0px',
      borderBottomRightRadius: '0px',
      overflowX: 'hidden',
      marginTop: '50px',
      marginBottom: '25px'
    },
    removeIcon:{
      padding: '0 5px'
    },
    toolbar:{
      flexDirection: 'column'
    },
    checkoutText:{
      fontSize: '0.8rem',
      fontWeight: '600'
    },
    CoBtn:{
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    emptyMsg:{
      display: items.length > 0 ? 'none':'flex',
      marginTop: '50px'
    },
    clrCart:{
      cursor: 'pointer',
      marginTop: '25px',
      color: '#fff',
      padding: '5px'
    }
  }));
  const classes = useStyles();

  useImperativeHandle(
    BottomCart,
    () => ({
      passDownItems(items){
          setItems([...items])
        }
     }),
  )
  const RemoveFromCart = (id) =>{
    removeFromCartHandler(id)
  }
  
  const openCart = () =>{
    if(cartOpen){
      setCartOpen(false)
    } else {
      setCartOpen(true)
    }
  }
  const openCartClickAway = () =>{
    setCartOpen(false)
  }

  const clearCartHandler = () =>{
    setItems([])
    emptyCart()
    clearNavCartState([])
  }

  return (
    <ClickAwayListener onClickAway={openCartClickAway}>
      <div className={classes.BottomBar}>
        <Toolbar className={classes.toolbar}>
          <Fab onClick={openCart} color="primary" aria-label="cart" className={classes.fabButton}>
            <ShoppingCartIcon color="secondary"/>
          </Fab>
          <div className={classes.emptyMsg}>
            <Typography variant="h6" color="primary" component="p">
              Your cart is empty!
            </Typography>
          </div>
          <div className={classes.priceContainer}>
            <div>
              <Typography variant="h6" color="primary" component="p">
                {items.length > 0 && `${items.length} item${items.length > 1 ? 's':''}`}
              </Typography>
            </div>
            <div>
              <Typography variant="h6" color="primary" component="p">
                {items.length > 0 ? `\$${items.reduce((a, b)=> ({price: a.price + b.price})).price.toFixed(2)}`:''}
              </Typography>
            </div>
          </div>
          <div>
          <Paper>
            <div className={classes.cartPaper}>
              {items.map((item)=>(
                <>
                  <div key={item.id} className={classes.cartItemContainer}>
                    <div className={classes.cartItemImageContainer}>
                      <Image src={`${item.image}`} alt={item.name} unsized={true} className={classes.cartItemImage}/>
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
          </Paper>
          {items.length >0 && 
            <div className={classes.CoBtn}>
              <Link href={`/checkout`} underline={'none'}>
                <Button variant="contained" color='primary'><DoneIcon color='secondary'/><Typography variant="h6" component="p" color='secondary' className={classes.checkoutText} >Proceed to Checkout</Typography></Button>
              </Link>
              <Typography onClick={clearCartHandler} variant="caption text" color="textSecondary" component="p" className={classes.clrCart}>
                Clear cart
              </Typography>
            </div>
          }
          </div>
        </Toolbar>
      </div>
    </ClickAwayListener>
  );
})
export default BottomNavar
