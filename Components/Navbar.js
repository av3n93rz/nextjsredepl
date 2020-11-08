import React, {useState, useEffect, useRef, forwardRef, useImperativeHandle}from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { withRouter } from 'next/router'
import AdminDrawer from './Drawer'
import NavbarCart from '../Components/NavbarCart'
import Image from 'next/image'


const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  buttons:{
    margin: '0 10px'
  },
  NavTitle: {
    color: '#fff',
  },
  search: {
    position: 'relative',
    display: 'flex',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '39px',
    cursor:'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  searchSpan:{
    width: 'auto',
    display: 'block',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    color: '#555',
    fontSize: '12px',
    lineHeight: '39px',
    marginRight: '5px',
    marginLeft: '10px',
    minWidth: '19px',
    color: '#171D23'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 1),
    transition: theme.transitions.create('width'),
    width: '20ch',
  },
  selectCategory:{
    display: 'block',
    top: '2.5px',
    position: 'absolute',
    left: '0',
    height: "35px",
    width: 'auto',
    outline:'0',
    margin: '0',
    padding: '0',
    cursor: 'pointer',
    opacity: '0',
    visibility: 'visible',
    border: '0',
    lineHeight: '35px',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  searchCategory:{
    display: 'flex',
    position: 'relative',
    float: 'left',
    cursor: 'default',
    overflow: 'hidden',
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('smd')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('smd')]: {
      display: 'none',
    },
  },
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
    display: 'flex',
    padding: '8px 16px'
  },
  cartPaper:{
    maxHeight: '266px',
    overflowY:'scroll',
    maxWidth: '300px',
    borderBottomLeftRadius: '0px',
    borderBottomRightRadius: '0px',
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
  }
}));

const Navbar = withRouter(({router, user, trigger, inputRef, setCheckout, passToBottom, displayCart = true}) => {
  const NavCartRef = useRef(null);
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState("All");
  const [cartItems, setCartItems] = useState([]);


  if(setCheckout){
    setCheckout(cartItems)
  }

  useEffect(()=>{
    const isCart = localStorage.getItem('cart')
    if(isCart){
      const cartObj = JSON.parse(localStorage.getItem('cart'))
      setCartItems(cartObj)
    }
  },[])

  useEffect(()=>{
    if(displayCart){
      NavCartRef.current.passDownItems(cartItems)
    }
    passToBottom(cartItems)
  }, [cartItems])

  const searchHandler = () =>{
    trigger(searchValue, category)
  }
  
  useImperativeHandle(inputRef, () => ({
    addToCartItems(product){
      const newItem = cartItems.find(x => x.id === product.id)
      if(!newItem){
        setCartItems([...cartItems, {...product}])
      } else {
        console.log('This item is already in your cart!')
      }
    },
    removeItemHandler(item){
      removeFromCartHandler(item)
    },
    clearCart(){
      setCartItems([])
    },
  }))

  const removeFromCartHandler = (item) => {
    let currentCart = cartItems
    const itemIndex = currentCart.indexOf(item)
    currentCart.splice(itemIndex, 1)
    setCartItems([...currentCart])
    localStorage.setItem('cart', JSON.stringify(currentCart))
  }

  return (
    <div className={classes.grow}>
      <AppBar position="static" color="secondary" style={{zIndex:'-1'}}>
        <Toolbar>
          <Link href="/" style={{textDecoration: 'none'}}>
            <Image
              src="/images/e-logo.png"
              alt="E-commerce logo"
              width={38}
              height={39}
              quality={100}
              priority={true}
            />
          </Link>
          <div className={classes.search}>
            <div className={classes.searchCategory}>
              <span className={classes.searchSpan}>
              {category}
              </span>
            <ArrowDropDownIcon style={{height:'39px'}}/>
            </div>
            <select name="categories" id="categories" className={classes.selectCategory} onChange={(e)=> setCategory(e.target.value)}>
              <option label="All" value="All">All</option>
              <option label="Phones" value="Phones">Phones</option>
              <option label="Cameras" value="Cameras">Cameras</option>
            </select>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={searchValue}
              onChange={(e)=>setSearchValue(e.target.value)}
            />
            <div className={classes.searchIcon} onClick={searchHandler}>
            <SearchIcon />
            </div>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
           {displayCart && <NavbarCart cartItems={cartItems} removeFromCartHandler={removeFromCartHandler} clearNavCartState={setCartItems} ref={NavCartRef}/>}
            {user ? 'isAdmin' in user ? (<AdminDrawer user={user}/>):router.pathname === "/login" ? "":(
              <Link href="/login" underline={'none'}>
                <Button variant="contained" color="primary" className={classes.buttons}>{"Login"}</Button>
              </Link>
              ):(
              <Link href="/login" underline={'none'}>
                <Button variant="contained" color="primary" className={classes.buttons}>{"Login"}</Button>
              </Link>
              )}
          </div>
          <div className={classes.sectionMobile}>

            <AdminDrawer user={user} isMobile={true}/>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
})

export default forwardRef((props, ref) =>{
return <Navbar {...props} inputRef={ref}/>
})
  