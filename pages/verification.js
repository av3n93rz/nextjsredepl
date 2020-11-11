import React, {useState} from 'react'
import Head from 'next/head'
import { makeStyles } from '@material-ui/core/styles';
import Navbar from '../Components/Navbar'
import {Container} from '@material-ui/core'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Image from 'next/image'
import verifyAccount from '../Components/hocs/verifyAccount';
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: '460px',
    margin: '0 auto',
    marginTop: '50px',
    marginBottom: '15px',
    paddingTop: '25px'
  },
  card_Content: {
    width: '306px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  verifiedSvg:{
    display: 'flex',
  },
  eComLogo:{
    display: 'flex',
    justifyContent: 'center',
    margin: '30px 0 25px 0'
  },
  status:{
    marginTop: '50px',
    textAlign: 'center',
  },
  buttonContainer:{
    marginTop: '25px',
    display: 'flex',
  }
}));

const Verification = ({verified}) => {
  const classes = useStyles();
  const [status, setStatus] = useState({
    msg: verified.status,
    user: verified.user || undefined
  })
  const sendToken = async() =>{
    try {
      const {data} = await axios.post(`/api/v1/users/sendToken/${verified.user._id}`)
      setStatus({...status, msg: data.status})
      return
      } catch (error) {
        console.log(error)
        console.error(error)
      }
  }

  return (
    <>
    <Head>
      <title>Webshop | Email verification</title>
      <meta name="Email verification" content="Verify your email address!"/>
      <link href="/globals.css" rel="stylesheet"/>
    </Head>
    <Navbar displayCart={false} searchable={false} showButtons={false}/>
    <Container>
      
      <Card className={classes.card}>
        <CardContent className={classes.card_Content}>
          <div className={classes.verifiedSvg}>
            {status.msg === 'Account verified!' ? 
            <Image src={'/svg/undraw_completed_ngx6.svg'} alt={'verified_svg'} width={'290px'} height={'200px'}/>
            :
            <Image src={'/svg/undraw_cancel_u1it.svg'} alt={'verified_svg'} width={'290px'} height={'200px'}/>
          }
          </div>
          <Typography variant="h5" color="secondary" component="p" className={classes.status}>
            {status.msg}
          </Typography>
          <div className={classes.buttonContainer}>
            {status.msg === 'Link expired!' ?
              <Button variant="contained" color="primary" onClick={sendToken}>Resend</Button>
              :
              <Link href="/login" underline={'none'}>
              <Button variant="contained" color="primary">Login</Button>
            </Link>
            }
          </div>
        </CardContent>
        <div className={classes.eComLogo}>
          <Image src={'/images/e-text-logo.png'} alt={'ecommerce-logo'} width={'71.5px'} height={'43.5px'} quality={100}/>
        </div>
      </Card>
    </Container>
    </>
  )
}

Verification.getInitialProps = async ({verified}) => {
  return {verified}
}

export default verifyAccount(Verification)
