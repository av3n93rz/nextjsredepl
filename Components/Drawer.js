import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ListIcon from '@material-ui/icons/List';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import axios from 'axios'
import IsLoggedOut from '../Components/hocs/IsLoggedOut'
import Router from 'next/router'
import PersonIcon from '@material-ui/icons/Person';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  buttons:{
    margin: '0 10px'
  },
  hamburgerIcon:{
    cursor: 'pointer'
  },
  linkColor:{
    color: '#707070'
  }
});

const AdminDrawer = ({user, isMobile=false}) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false)
  const [loggedOut, setLoggedOut] = useState(false)

  useEffect(()=>{
    if(loggedOut){
      Router.reload(window.location.pathname);
    }
  }, [loggedOut])

  const logout = async () => {
    try {
      const res = await axios({
        method: 'GET',
        url: '/api/v1/users/logout'
      });
      if(res.status === 200 && res.data.status === 'success'){
        setLoggedOut(true)
      }
    } catch (err) {
      console.log(err.response);
      
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setIsOpen(open);
  };

  const list = () => (
    <div role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      { user ? user.isAdmin ? (
        <>
          <List>
            <Link href="/admin/UserList" underline='none'>
              <ListItem button key={'UserList'}>
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary={'User List'} className={classes.linkColor}/>
              </ListItem>
            </Link>
            <Link href="/admin/products/ProductList" underline='none'>
              <ListItem button key={'ProductList'}>
                <ListItemIcon>
                  <ListIcon />
                </ListItemIcon>
                <ListItemText primary={'Product List'} className={classes.linkColor}/>
              </ListItem>
            </Link>
            <Link href="/admin/products/AddProduct" underline='none'>
              <ListItem button key={'AddProduct'}>
                <ListItemIcon>
                  <PlusOneIcon />
                </ListItemIcon>
                <ListItemText primary={'Add Product'} className={classes.linkColor}/>
              </ListItem>
            </Link>
          </List>
          <Divider />
          <List>
            <ListItem button key={'Logout'} onClick={logout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={'Logout'} className={classes.linkColor}/>
            </ListItem>
          </List>
      </>
      ):(
        <List>
            <ListItem button key={'Logout'} onClick={logout}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={'Logout'} className={classes.linkColor}/>
            </ListItem>
        </List>
      ):(
        <List>
          <Link href="/login?redirected=true" underline='none'>
              <ListItem button key={'Login'}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={'Login'} className={classes.linkColor}/>
              </ListItem>
            </Link>
        </List>
      )
      }
    </div>
  );

  return (
    <div>
          {isMobile ? (<MenuIcon onClick={toggleDrawer(true)} className={classes.hamburgerIcon}/>):(<Button variant="contained" color="primary" className={classes.buttons} onClick={toggleDrawer(true)}>{user.name}</Button>)}
          <Drawer anchor={'right'} open={isOpen} onClose={toggleDrawer(false)}>
            {list()}
          </Drawer>
    </div>
  );
}

export default IsLoggedOut(AdminDrawer)
