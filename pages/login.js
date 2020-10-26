import React, {useState, useEffect} from 'react'
import Head from 'next/head'
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../Components/Navbar'
import {Container} from '@material-ui/Core'
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Link from '@material-ui/core/Link';
import Router, { useRouter } from 'next/router'
import IsLoggedIn from '../Components/IsLoggedIn'
import {signin} from '../core/apiCore'

const useStyles = makeStyles((theme) => ({
  login_Card: {
    maxWidth: '460px',
    margin: '0 auto',
    marginTop: '150px' 
  },
  inputField: {
    display: 'flex',
    width: 'fit-content',
    margin: '0 auto',
  },
  padding: {
    padding: '4px'
  },
  h1_title: {
    textAlign: 'center',
    fontSize: '30px',
    marginBottom: '20px',
    color: '#000',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  card_Content: {
    width: '306px',
    margin: '0 auto',
  },
  signInButton_Container:{
    width: '274px',
    display: 'flex',
    marginBottom: '20px'
  },
  noAccountText:{
    fontSize: '12px',
    margin:'0 auto',
    textAlign: 'center',
  }
}));

const login = () => {
  const classes = useStyles();

  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [pwValues, setPwValues] = useState({
    password: '',
    showPassword: false,
  });

  const router = useRouter()

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handlePasswordChange = (event) => {
    setPwValues({ ...pwValues, password: event.target.value });
  };

  const handleClickShowPassword = () => {
    setPwValues({ ...pwValues, showPassword: !pwValues.showPassword });
  };

  const loginHandler = async (e) =>{
    e.preventDefault()
    const SignedInUser = await signin({email, pwValues})
    if(SignedInUser.status === "success"){
      setSuccess(true)
    }
    
  }

  useEffect(()=>{
    if(success){
      Router.reload(window.location.pathname);
    }
  },[success])

  return (
    <>
    <Head>
      <title>Webshop | Login</title>
    </Head>
    <Navbar />
    <Container>
      <Card className={classes.login_Card}>
        <CardContent className={classes.card_Content}>
            <Typography className={classes.h1_title} variant="h1" noWrap>
              Sign In
            </Typography>
            <Grid container spacing={1} alignItems="flex-end" className={classes.inputField} style={{marginBottom:'20px'}}>
              <Grid item>
                <AccountCircle />
              </Grid>
              <Grid item>
                <TextField id="input-with-icon-grid" label="Email address" value={email} onChange={(e)=> setEmail(e.target.value)} style={{width: '234px'}} />
              </Grid>
            </Grid>
            <Grid container spacing={1} alignItems="flex-end" className={classes.inputField} style={{marginBottom: '20px'}}>
              <Grid item>
                <VpnKeyIcon />
              </Grid>
              <FormControl className={classes.padding} style={{width: '242px'}}>
                <InputLabel htmlFor="standard-adornment-password" className={classes.padding}>Password</InputLabel>
                <Input
                  id="standard-adornment-password"
                  type={pwValues.showPassword ? 'text' : 'password'}
                  value={pwValues.password}
                  onChange={(e) => handlePasswordChange(e)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {pwValues.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <div className={classes.signInButton_Container}>
              <Button variant="contained" color="primary" style={{marginLeft: 'auto'}} onClick={loginHandler}>Sign In</Button>
            </div>
            <Typography variant="h6" noWrap className={classes.noAccountText}>
              Don't have an account? <Link href='/signup'>Sign Up!</Link>
            </Typography>
        </CardContent>
      </Card>
    </Container>
    </>
  )
}

export default IsLoggedIn(login)
