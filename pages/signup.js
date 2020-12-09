import React, {useState, useEffect, useRef} from 'react'
import Head from 'next/head'
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../Components/Navbar'
import {Container} from '@material-ui/core'
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
import IsLoggedIn from '../Components/hocs/IsLoggedIn'
import {signupApi} from '../core/apiCore'
import EmailIcon from '@material-ui/icons/Email';
import Alert from '@material-ui/lab/Alert';
import Router from 'next/router'
import Image from 'next/image'

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
  },
  AuthSvg:{
    position: 'absolute',
    zIndex: '-1',
    top: '300px',
    left: '45%',
    [theme.breakpoints.down('smd')]: {
      top: '460px',
      left: '30%',
      width: '450px'
    },
    [theme.breakpoints.down('xs')]: {
      top: '460px',
      left: '20%',
      width: '450px'
    },
  },
}));

const signup = () => {
  const classes = useStyles();
  const childNav = useRef(null);
  const BottomCart = useRef(null);
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState({
    err: false,
    msg:""
  })
  const [pwValues, setPwValues] = useState({
    password: '',
    showPassword: false,
    confirmPassword: '',
    showConfirmPassword: false,
  });

  const removeFromCartHandler = (id) =>{
    childNav.current.removeItemHandler(id)
  }

  const clearNavCartState = () =>{
    childNav.current.clearCart()
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handlePasswordChange = (event) => {
    setPwValues({ ...pwValues, password: event.target.value });
  };

  const handleClickShowPassword = () => {
    setPwValues({ ...pwValues, showPassword: !pwValues.showPassword });
  };

  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  const handleConfirmPasswordChange = (event) => {
    setPwValues({ ...pwValues, confirmPassword: event.target.value });
  };

  const handleClickShowConfirmPassword = () => {
    setPwValues({ ...pwValues, showConfirmPassword: !pwValues.showConfirmPassword });
  };

  const validator = () =>{
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(email)
  }

  const signupHandler = async (e) =>{
    e.preventDefault()
    setError({err:false, msg:''})
    if(validator()){
      if(pwValues.password === pwValues.confirmPassword){
        const isSignedUp = await signupApi({name, email, password:pwValues.password})
        if(isSignedUp.error){
          setError({err: true, msg:isSignedUp.error})
        }
        if(isSignedUp.status === 'success'){
          setSuccess(true)
        }
      } else {
        setError({err: true, msg:'Passwords do not match!'})
      }
    } else {
      setError({err: true, msg:'Email format is not valid!'})
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
      <title>Webshop | Sign Up</title>
      <meta name="description" content="Create your Avi\'s shop account!"/>
    </Head>
    <Navbar displayCart={false} searchable={false}/>
    <Container>
      <div className={classes.AuthSvg}>
        <Image src={'/svg/undraw_personal_information_962o.svg'} alt={'auth_svg'} width={'580px'} height={'400px'}/>
      </div>
      <Card className={classes.login_Card}>
        <CardContent className={classes.card_Content}>
            <Typography className={classes.h1_title} variant="h1" noWrap>
              Sign Up
            </Typography>
            {error.err && <Alert variant="filled" severity="error">{error.msg}</Alert>}
            <Grid container spacing={1} alignItems="flex-end" className={classes.inputField} style={{marginBottom:'20px'}}>
              <Grid item>
                <AccountCircle />
              </Grid>
              <Grid item>
                <TextField required id="input-with-icon-grid" label="Name" value={name} onChange={(e)=> setName(e.target.value)} style={{width: '234px'}} />
              </Grid>
            </Grid>
            <Grid container spacing={1} alignItems="flex-end" className={classes.inputField} style={{marginBottom:'20px'}}>
              <Grid item>
                <EmailIcon/>
              </Grid>
              <Grid item>
                <TextField required id="input-with-icon-grid" label="Email address" value={email} onChange={(e)=> setEmail(e.target.value)} style={{width: '234px'}} />
              </Grid>
            </Grid>
            <Grid container spacing={1} alignItems="flex-end" className={classes.inputField} style={{marginBottom: '20px'}}>
              <Grid item>
                <VpnKeyIcon />
              </Grid>
              <FormControl required className={classes.padding} style={{width: '242px'}}>
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
            <Grid container spacing={1} alignItems="flex-end" className={classes.inputField} style={{marginBottom: '20px'}}>
              <Grid item>
                <VpnKeyIcon />
              </Grid>
              <FormControl required className={classes.padding} style={{width: '242px'}}>
                <InputLabel htmlFor="standard-adornment-confirm-password" className={classes.padding}>Confirm Password</InputLabel>
                <Input 
                  id="standard-adornment-confirm-password"
                  type={pwValues.showConfirmPassword ? 'text' : 'password'}
                  value={pwValues.confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownConfirmPassword}
                      >
                        {pwValues.showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
            <div className={classes.signInButton_Container}>
              <Button variant="contained" color="primary" style={{marginLeft: 'auto'}} onClick={signupHandler}>Sign Up</Button>
            </div>
            <Typography variant="h6" noWrap className={classes.noAccountText}>
              Already have an account? <Link href='/signin'>Sign In!</Link>
            </Typography>
        </CardContent>
      </Card>
    </Container>
    </>
  )
}

export default IsLoggedIn(signup)
