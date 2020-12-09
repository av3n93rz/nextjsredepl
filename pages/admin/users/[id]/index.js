import React, {useState, useEffect} from 'react';
import PrivateRoute from '../../../../Components/hocs/PrivateRoute';
import axios from 'axios'
import Head from 'next/head'
import Navbar from '../../../../Components/Navbar'
import {Container} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Image from 'next/image'
import Paper from '@material-ui/core/Paper';
import getUserProfile from '../../../../Components/hocs/getUserProfile'
import moment from 'moment'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Pagination from '@material-ui/core/Pagination';
import Divider from '@material-ui/core/Divider';
moment.locale('hu');

const useStyles = makeStyles((theme) => ({
  Container:{
    marginTop: '50px',
    marginBottom: '50px',
  },
  Paper:{
    width: '100%',
    marginBottom: '50px'
  },
  profile:{
    display: 'flex'
  },
  svgContainer:{
    padding: '15px',
    paddingRight: '30px'
  },
  userData:{
    padding: '15px'
  },
  role:{
    display: 'flex',
    justifyContent:'center',
    '& p':{
      textAlign: 'center',
      paddingTop: '5px'
    }
  },
  orderId_date:{
    display: 'flex',
    justifyContent: 'space-between'
  },
  SingleOrder:{
    padding: '15px 0px',
    width: '100%',
    paddingRight: '15px'
  },
  OrderPaper:{
    width: '100%',
    marginBottom: '50px',
  },
  items_status:{
    display: 'flex',
    justifyContent: 'space-between'
  },
  OrdersSec:{
    padding: '15px'
  },
  pagination:{
    display: 'flex',
    justifyContent: 'center',
    padding: '15px'
  },
  orderedItemImage:{
    maxHeight: '-webkit-fill-available',
    maxWidth: '75px'
  },
  oItemImageContainer:{
    display: 'flex',
    justifyContent: 'center',
    width: '75px',
    height: '60px',
    overflow: 'hidden',
    marginBottom: '15px'
  },
  oItemContainer:{
    display: 'flex'
  },
  oItemTitle:{
    paddingLeft: '15px',
    display: 'flex',
    flexDirection: 'column',
    '& p':{
      fontSize: '0.9rem'
    }
  },
  oItemPrice:{
    marginLeft: 'auto',
    marginRight: '0px',
    '& p':{
      fontWeight: '600',
      fontSize: '0.9rem'
    }
  },
  totalAmount:{
    marginTop: '10px',
    '& p':{
      fontSize: '0.9rem',
      textAlign: 'right',
      '&:last-child':{
        fontWeight: '600',
      }
    }
  },
  address:{
    marginBottom: '25px'
  },
  paymentDetails:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  }
}));

const index = ({user, userAuth}) => {
  const classes = useStyles();
  const [orderHistory, setOrderHistory] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState('');
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(()=>{
    getOrders(page)
  },[])

  const getOrders = async(num)=>{
    try {
      const {data} = await axios.get(`/api/v1/orders/by/user/${user._id}?pageNumber=${num}`)
      setPages(data.pages)
      setOrderHistory(data.orders)
      return
    } catch (error) {
      console.error(error)
    }
  }

  const handlePagination = (event, value) => {
    setExpanded(false)
    setPage(value);
    getOrders(value)
  };

  return (
    <>
      <Head>
        <title>{user.name}'s profile</title>
      </Head>
      <Navbar user={userAuth && userAuth}/>
      <Container maxWidth="sm" className={classes.Container}>
        <Paper className={classes.Paper}>
        <div className={classes.profile}>
          <div className={classes.svgContainer}>
            <Image src={'/svg/undraw_male_avatar_323b.svg'} alt={'user-svg'} width={'100px'} height={'100px'} quality={100}/>
            <div className={classes.role}>
              { user.activated === 'true' ? <VerifiedUserIcon/>:''}
              <Typography variant="subtitle" color="textSecondary" component="p">
              {user.isAdmin ? 'Admin':'User'}
            </Typography>
            </div>
          </div>
          <div className={classes.userData}>
            <Typography variant="h6" color="textSecondary" component="p">
              ID: {user._id}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" component="p">
              Name: {user.name}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" component="p">
              Email: {user.email}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" component="p">
              Created: {moment(user.createdAt).format('lll')}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" component="p">
              Updated: {moment(user.updatedAt).format('lll')}
            </Typography>
          </div>
        </div>
        </Paper>
        <Paper className={classes.OrderPaper}>
          <Typography variant="h6" color="textSecondary" component="p" className={classes.OrdersSec}>
            Order history
          </Typography>
          {orderHistory.map((item, index) => (
            <Accordion expanded={expanded === `panel${index}`} onChange={handleChange(`panel${index}`)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}bh-content`} id={`panel${index}bh-header`}>
                <div className={classes.SingleOrder}>
                  <div className={classes.orderId_date}>
                    <Typography variant="button" color="textSecondary" component="p">
                      ID: {item._id}
                    </Typography>
                    <Typography variant="button" color="textSecondary" component="p">
                      {moment(item.createdAt).format('lll')}
                    </Typography>
                  </div>
                  <div className={classes.items_status}>
                    <Typography variant="caption" color="textSecondary" component="p">
                      Items: {item.orderItems.length}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" component="p">
                      Status: <strong>{item.isDelivered ? 'Delivered':'Not delivered'}</strong>
                    </Typography>
                  </div>
                  <div className={classes.paymentDetails}>
                    <Typography variant="caption" color="textSecondary" component="p">
                      Shipping method: {item.shippingMethod}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" component="p">
                      Payment method: {item.paymentMethod}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" component="p">
                      <strong>
                        {item.paidAt ? `Paid at ${moment(item.paidAt).format('lll')}`:`Not paid!`}
                      </strong>
                    </Typography>
                  </div>
                </div>
              </AccordionSummary>
              <AccordionDetails>
                <div className={classes.address}>
                  <Typography variant="caption" color="textSecondary" component="p" >
                    <strong>Shipping Address</strong>
                  </Typography>
                  <Typography variant="caption" color="textSecondary" component="p" >
                    Name: {item.shippingAddress.fullName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" component="p" >
                    Phone: {item.shippingAddress.phoneNum}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" component="p" >
                    Country: {item.shippingAddress.country}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" component="p" >
                    Zip code: {item.shippingAddress.zipCode}
                  </Typography>
                  {item.shippingAddress.county !== "" && <Typography variant="caption" color="textSecondary" component="p" >
                    County: {item.shippingAddress.county}
                  </Typography>}
                  <Typography variant="caption" color="textSecondary" component="p" >
                    City: {item.shippingAddress.city}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" component="p" >
                    Address line 1: {item.shippingAddress.addressLine1}
                  </Typography>
                  {item.shippingAddress.addressLine2 !== "" && <Typography variant="caption" color="textSecondary" component="p" >
                    Address line 2: {item.shippingAddress.addressLine2}
                  </Typography>}
                  {item.shippingAddress.comment !== "" && <Typography variant="caption" color="textSecondary" component="p" >
                    Comment: {item.shippingAddress.comment}
                  </Typography>}
                </div>
                {item.orderItems.map((oItem)=>(
                  <>
                    <div className={classes.oItemContainer}>
                      <div className={classes.oItemImageContainer}>
                        <Image src={`${oItem.image}`} alt={oItem.name} unsized={true} className={classes.orderedItemImage}/>
                      </div>
                      <div className={classes.oItemTitle}>
                        <Link href={`/product/id?product=${oItem.id}`} underline={'none'}>
                          <Typography variant="caption" color="textSecondary" component="p">
                            {oItem.name}
                          </Typography>
                        </Link>
                        <Typography variant="caption" color="textSecondary" component="p">
                          Pcs: {oItem.count}
                        </Typography>
                      </div>
                      <div className={classes.oItemPrice}>
                        <Typography variant="caption" color="textSecondary" component="p">
                          ${oItem.price}
                        </Typography>
                      </div>
                    </div>
                  </>
                ))}
                <Divider variant="middle"/>
                  <div className={classes.totalAmount}>
                    <Typography variant="caption" color="textSecondary" component="p" >
                      Items price: ${item.itemsPrice}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" component="p">
                      Deliver price: ${item.shippingPrice}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" component="p">
                      Total price: ${item.totalPrice}
                    </Typography>
                  </div>
              </AccordionDetails>
            </Accordion>
          ))}
          <Pagination count={pages} color="primary" page={page} onChange={handlePagination} className={classes.pagination}/>
        </Paper>
      </Container>
    </>
  )
}

index.getInitialProps = async (user) => {
  return {user}
}

export default PrivateRoute(getUserProfile(index))
