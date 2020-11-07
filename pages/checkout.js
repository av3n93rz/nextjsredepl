import Head from 'next/head'
import React, {useState, useRef, useEffect} from 'react'
import Navbar from '../Components/Navbar'
import {Container} from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import PaymentIcon from '@material-ui/icons/Payment';
import Image from 'next/image'
import Link from '@material-ui/core/Link';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import axios from 'axios'
import DropIn from 'braintree-web-drop-in-react'
import getCookie from '../Components/hocs/getCookie'
import {getBraintreeClientToken, processPayment} from '../core/braintreeCore'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import {emptyCart} from '../core/cartHandlers'
import BottomNavbar from '../Components/BottomNavbar'


const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
  completed: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  },
});

function ColorlibStepIcon(props) {
  const classes = useColorlibStepIconStyles();
  const { active, completed } = props;

  const icons = {
    1: <LocalShippingIcon />,
    2: <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path style={{transform: 'scale(1.467)'}} fillRule="evenodd" d="M1 4.27v7.47c0 .45.3.84.75.97l6.5 1.73c.16.05.34.05.5 0l6.5-1.73c.45-.13.75-.52.75-.97V4.27c0-.45-.3-.84-.75-.97l-6.5-1.74a1.4 1.4 0 0 0-.5 0L1.75 3.3c-.45.13-.75.52-.75.97zm7 9.09l-6-1.59V5l6 1.61v6.75zM2 4l2.5-.67L11 5.06l-2.5.67L2 4zm13 7.77l-6 1.59V6.61l2-.55V8.5l2-.53V5.53L15 5v6.77zm-2-7.24L6.5 2.8l2-.53L15 4l-2 .53z"></path></svg>,
    3: <AssignmentTurnedInIcon/>,
    4: <PaymentIcon/>,
  };

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  );
}

ColorlibStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node,
};

function getSteps() {
  return ['Address', 'Cart items', 'Place order', 'Payment'];
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  stepContainer:{
    marginTop: '50px',
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  stepOneform:{
    display: 'flex',
    flexDirection: 'column'
  },
  mainContainer:{
    marginTop:'30px',
    display: 'flex',
    flexDirection: 'column',
  },
  SubmitButton:{
    padding: '0px'
  },
  SubmitLabel:{
    width: '100%',
    padding: '6px 16px'
  },
  SubmitInput:{
    width: '0px',
    height: '0px',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '5px',
    visibility: 'hidden'
  },
  btnGroup:{
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '30px',
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
    marginBottom: '20px'
  },
  cartItemTitle:{
    display: 'block',
    display: '-webkit-box',
    maxWidth: '260px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },
  removeContainer:{
    marginRight: '0px',
    marginLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  priceContainer:{
    marginRight: '0px',
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '& p':{
      paddingLeft: '15px',
      fontWeight: '600'
    }
  },
  subtotalContainer:{
    display: 'flex',
    width: 'fit-content',
    marginLeft: 'auto',
    marginRight: '68px',
    marginTop: '10px',
    '& p':{
        fontSize: '1.1rem',
      '&:last-child':{
        marginLeft: '25px',
        fontWeight: '600'
      }
    }
  },
  radioContainer:{
    display: 'flex',
    flexDirection: 'column'
  },
  radioOption:{
    marginLeft: '10px',
    marginBottom: '5px'
  },
  total:{
    display: 'flex',
    justifyContent: 'flex-end',
    '& p':{
      '&:last-child':{
        fontWeight: '600',
        marginLeft: '10px'
      }
    }
  },
  tos:{
    display: 'flex',
    marginTop:'25px'
  },
  ThankYou:{
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  payBtn:{
    backgroundColor: '#ff9800',
    display:'block',
    width: '100%',
    '&:hover':{
      backgroundColor: '#f57c00'
    },
    '& span':{
      color: '#fff',
      fontWeight: '600'
    }
  },
  dropIn:{
    marginTop: '50px',
    marginBottom: '15px'
  },
  ctnShppngBtn:{
    display:'flex',
    justifyContent: 'center',
    marginTop: '25px'
  },
  emptyContainer:{
    marginTop: '50px'
  },
  centerText:{
    textAlign: 'center'
  }
}));

 const checkout = ({userAuth, cookie}) => {
  const childNav = useRef(null);
  const BottomCart = useRef(null);
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [orderItems, setOrderItems] = useState([]);
  const [orderBtn, setOrderBtn] = useState("online");
  const [delivery, setDelivery] = useState({
    value: 5
  });
  const [payment, setPayment] = useState({
    value: "online"
  });
  const [address, setAddress] = useState({
    country: "",
    fullName: "",
    phoneNum: "",
    zipCode: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    county: "",
    comment: "",
  });
  const [data, setData] = useState({
    success: '',
    clientToken: null,
    error: '',
    instance:{},
    orderId:''
  });
  const steps = getSteps();

  const countries = [
    {"name": "Albania", "code": "AL"},
    {"name": "Åland Islands", "code": "AX"},
    {"name": "Algeria", "code": "DZ"},
    {"name": "American Samoa", "code": "AS"},
    {"name": "Andorra", "code": "AD"},
    {"name": "Angola", "code": "AO"},
    {"name": "Anguilla", "code": "AI"},
    {"name": "Antarctica", "code": "AQ"},
    {"name": "Antigua and Barbuda", "code": "AG"},
    {"name": "Argentina", "code": "AR"},
    {"name": "Armenia", "code": "AM"},
    {"name": "Aruba", "code": "AW"},
    {"name": "Australia", "code": "AU"},
    {"name": "Austria", "code": "AT"},
    {"name": "Azerbaijan", "code": "AZ"},
    {"name": "Bahamas (the)", "code": "BS"},
    {"name": "Bahrain", "code": "BH"},
    {"name": "Bangladesh", "code": "BD"},
    {"name": "Barbados", "code": "BB"},
    {"name": "Belarus", "code": "BY"},
    {"name": "Belgium", "code": "BE"},
    {"name": "Belize", "code": "BZ"},
    {"name": "Benin", "code": "BJ"},
    {"name": "Bermuda", "code": "BM"},
    {"name": "Bhutan", "code": "BT"},
    {"name": "Bolivia (Plurinational State of)", "code": "BO"},
    {"name": "Bonaire, Sint Eustatius and Saba", "code": "BQ"},
    {"name": "Bosnia and Herzegovina", "code": "BA"},
    {"name": "Botswana", "code": "BW"},
    {"name": "Bouvet Island", "code": "BV"},
    {"name": "Brazil", "code": "BR"},
    {"name": "British Indian Ocean Territory (the)", "code": "IO"},
    {"name": "Brunei Darussalam", "code": "BN"},
    {"name": "Bulgaria", "code": "BG"},
    {"name": "Burkina Faso", "code": "BF"},
    {"name": "Burundi", "code": "BI"},
    {"name": "Cabo Verde", "code": "CV"},
    {"name": "Cambodia", "code": "KH"},
    {"name": "Cameroon", "code": "CM"},
    {"name": "Canada", "code": "CA"},
    {"name": "Cayman Islands (the)", "code": "KY"},
    {"name": "Central African Republic (the)", "code": "CF"},
    {"name": "Chad", "code": "TD"},
    {"name": "Chile", "code": "CL"},
    {"name": "China", "code": "CN"},
    {"name": "Christmas Island", "code": "CX"},
    {"name": "Cocos (Keeling) Islands (the)", "code": "CC"},
    {"name": "Colombia", "code": "CO"},
    {"name": "Comoros (the)", "code": "KM"},
    {"name": "Congo (the Democratic Republic of the)", "code": "CD"},
    {"name": "Congo (the)", "code": "CG"},
    {"name": "Cook Islands (the)", "code": "CK"},
    {"name": "Costa Rica", "code": "CR"},
    {"name": "Croatia", "code": "HR"},
    {"name": "Cuba", "code": "CU"},
    {"name": "Curaçao", "code": "CW"},
    {"name": "Cyprus", "code": "CY"},
    {"name": "Czechia", "code": "CZ"},
    {"name": "Côte d'Ivoire", "code": "CI"},
    {"name": "Denmark", "code": "DK"},
    {"name": "Djibouti", "code": "DJ"},
    {"name": "Dominica", "code": "DM"},
    {"name": "Dominican Republic (the)", "code": "DO"},
    {"name": "Ecuador", "code": "EC"},
    {"name": "Egypt", "code": "EG"},
    {"name": "El Salvador", "code": "SV"},
    {"name": "Equatorial Guinea", "code": "GQ"},
    {"name": "Eritrea", "code": "ER"},
    {"name": "Estonia", "code": "EE"},
    {"name": "Eswatini", "code": "SZ"},
    {"name": "Ethiopia", "code": "ET"},
    {"name": "Falkland Islands (the) [Malvinas]", "code": "FK"},
    {"name": "Faroe Islands (the)", "code": "FO"},
    {"name": "Fiji", "code": "FJ"},
    {"name": "Finland", "code": "FI"},
    {"name": "France", "code": "FR"},
    {"name": "French Guiana", "code": "GF"},
    {"name": "French Polynesia", "code": "PF"},
    {"name": "French Southern Territories (the)", "code": "TF"},
    {"name": "Gabon", "code": "GA"},
    {"name": "Gambia (the)", "code": "GM"},
    {"name": "Georgia", "code": "GE"},
    {"name": "Germany", "code": "DE"},
    {"name": "Ghana", "code": "GH"},
    {"name": "Gibraltar", "code": "GI"},
    {"name": "Greece", "code": "GR"},
    {"name": "Greenland", "code": "GL"},
    {"name": "Grenada", "code": "GD"},
    {"name": "Guadeloupe", "code": "GP"},
    {"name": "Guam", "code": "GU"},
    {"name": "Guatemala", "code": "GT"},
    {"name": "Guernsey", "code": "GG"},
    {"name": "Guinea", "code": "GN"},
    {"name": "Guinea-Bissau", "code": "GW"},
    {"name": "Guyana", "code": "GY"},
    {"name": "Haiti", "code": "HT"},
    {"name": "Heard Island and McDonald Islands", "code": "HM"},
    {"name": "Holy See (the)", "code": "VA"},
    {"name": "Honduras", "code": "HN"},
    {"name": "Hong Kong", "code": "HK"},
    {"name": "Hungary", "code": "HU"},
    {"name": "Iceland", "code": "IS"},
    {"name": "India", "code": "IN"},
    {"name": "Indonesia", "code": "ID"},
    {"name": "Iran (Islamic Republic of)", "code": "IR"},
    {"name": "Iraq", "code": "IQ"},
    {"name": "Ireland", "code": "IE"},
    {"name": "Isle of Man", "code": "IM"},
    {"name": "Israel", "code": "IL"},
    {"name": "Italy", "code": "IT"},
    {"name": "Jamaica", "code": "JM"},
    {"name": "Japan", "code": "JP"},
    {"name": "Jersey", "code": "JE"},
    {"name": "Jordan", "code": "JO"},
    {"name": "Kazakhstan", "code": "KZ"},
    {"name": "Kenya", "code": "KE"},
    {"name": "Kiribati", "code": "KI"},
    {"name": "Korea (the Democratic People's Republic of)", "code": "KP"},
    {"name": "Korea (the Republic of)", "code": "KR"},
    {"name": "Kuwait", "code": "KW"},
    {"name": "Kyrgyzstan", "code": "KG"},
    {"name": "Lao People's Democratic Republic (the)", "code": "LA"},
    {"name": "Latvia", "code": "LV"},
    {"name": "Lebanon", "code": "LB"},
    {"name": "Lesotho", "code": "LS"},
    {"name": "Liberia", "code": "LR"},
    {"name": "Libya", "code": "LY"},
    {"name": "Liechtenstein", "code": "LI"},
    {"name": "Lithuania", "code": "LT"},
    {"name": "Luxembourg", "code": "LU"},
    {"name": "Macao", "code": "MO"},
    {"name": "Madagascar", "code": "MG"},
    {"name": "Malawi", "code": "MW"},
    {"name": "Malaysia", "code": "MY"},
    {"name": "Maldives", "code": "MV"},
    {"name": "Mali", "code": "ML"},
    {"name": "Malta", "code": "MT"},
    {"name": "Marshall Islands (the)", "code": "MH"},
    {"name": "Martinique", "code": "MQ"},
    {"name": "Mauritania", "code": "MR"},
    {"name": "Mauritius", "code": "MU"},
    {"name": "Mayotte", "code": "YT"},
    {"name": "Mexico", "code": "MX"},
    {"name": "Micronesia (Federated States of)", "code": "FM"},
    {"name": "Moldova (the Republic of)", "code": "MD"},
    {"name": "Monaco", "code": "MC"},
    {"name": "Mongolia", "code": "MN"},
    {"name": "Montenegro", "code": "ME"},
    {"name": "Montserrat", "code": "MS"},
    {"name": "Morocco", "code": "MA"},
    {"name": "Mozambique", "code": "MZ"},
    {"name": "Myanmar", "code": "MM"},
    {"name": "Namibia", "code": "NA"},
    {"name": "Nauru", "code": "NR"},
    {"name": "Nepal", "code": "NP"},
    {"name": "Netherlands (the)", "code": "NL"},
    {"name": "New Caledonia", "code": "NC"},
    {"name": "New Zealand", "code": "NZ"},
    {"name": "Nicaragua", "code": "NI"},
    {"name": "Niger (the)", "code": "NE"},
    {"name": "Nigeria", "code": "NG"},
    {"name": "Niue", "code": "NU"},
    {"name": "Norfolk Island", "code": "NF"},
    {"name": "Northern Mariana Islands (the)", "code": "MP"},
    {"name": "Norway", "code": "NO"},
    {"name": "Oman", "code": "OM"},
    {"name": "Pakistan", "code": "PK"},
    {"name": "Palau", "code": "PW"},
    {"name": "Palestine, State of", "code": "PS"},
    {"name": "Panama", "code": "PA"},
    {"name": "Papua New Guinea", "code": "PG"},
    {"name": "Paraguay", "code": "PY"},
    {"name": "Peru", "code": "PE"},
    {"name": "Philippines (the)", "code": "PH"},
    {"name": "Pitcairn", "code": "PN"},
    {"name": "Poland", "code": "PL"},
    {"name": "Portugal", "code": "PT"},
    {"name": "Puerto Rico", "code": "PR"},
    {"name": "Qatar", "code": "QA"},
    {"name": "Republic of North Macedonia", "code": "MK"},
    {"name": "Romania", "code": "RO"},
    {"name": "Russian Federation (the)", "code": "RU"},
    {"name": "Rwanda", "code": "RW"},
    {"name": "Réunion", "code": "RE"},
    {"name": "Saint Barthélemy", "code": "BL"},
    {"name": "Saint Helena, Ascension and Tristan da Cunha", "code": "SH"},
    {"name": "Saint Kitts and Nevis", "code": "KN"},
    {"name": "Saint Lucia", "code": "LC"},
    {"name": "Saint Martin (French part)", "code": "MF"},
    {"name": "Saint Pierre and Miquelon", "code": "PM"},
    {"name": "Saint Vincent and the Grenadines", "code": "VC"},
    {"name": "Samoa", "code": "WS"},
    {"name": "San Marino", "code": "SM"},
    {"name": "Sao Tome and Principe", "code": "ST"},
    {"name": "Saudi Arabia", "code": "SA"},
    {"name": "Senegal", "code": "SN"},
    {"name": "Serbia", "code": "RS"},
    {"name": "Seychelles", "code": "SC"},
    {"name": "Sierra Leone", "code": "SL"},
    {"name": "Singapore", "code": "SG"},
    {"name": "Sint Maarten (Dutch part)", "code": "SX"},
    {"name": "Slovakia", "code": "SK"},
    {"name": "Slovenia", "code": "SI"},
    {"name": "Solomon Islands", "code": "SB"},
    {"name": "Somalia", "code": "SO"},
    {"name": "South Africa", "code": "ZA"},
    {"name": "South Georgia and the South Sandwich Islands", "code": "GS"},
    {"name": "South Sudan", "code": "SS"},
    {"name": "Spain", "code": "ES"},
    {"name": "Sri Lanka", "code": "LK"},
    {"name": "Sudan (the)", "code": "SD"},
    {"name": "Suriname", "code": "SR"},
    {"name": "Svalbard and Jan Mayen", "code": "SJ"},
    {"name": "Sweden", "code": "SE"},
    {"name": "Switzerland", "code": "CH"},
    {"name": "Syrian Arab Republic", "code": "SY"},
    {"name": "Taiwan (Province of China)", "code": "TW"},
    {"name": "Tajikistan", "code": "TJ"},
    {"name": "Tanzania, United Republic of", "code": "TZ"},
    {"name": "Thailand", "code": "TH"},
    {"name": "Timor-Leste", "code": "TL"},
    {"name": "Togo", "code": "TG"},
    {"name": "Tokelau", "code": "TK"},
    {"name": "Tonga", "code": "TO"},
    {"name": "Trinidad and Tobago", "code": "TT"},
    {"name": "Tunisia", "code": "TN"},
    {"name": "Turkey", "code": "TR"},
    {"name": "Turkmenistan", "code": "TM"},
    {"name": "Turks and Caicos Islands (the)", "code": "TC"},
    {"name": "Tuvalu", "code": "TV"},
    {"name": "Uganda", "code": "UG"},
    {"name": "Ukraine", "code": "UA"},
    {"name": "United Arab Emirates (the)", "code": "AE"},
    {"name": "United Kingdom of Great Britain and Northern Ireland (the)", "code": "GB"},
    {"name": "United States Minor Outlying Islands (the)", "code": "UM"},
    {"name": "United States of America (the)", "code": "US"},
    {"name": "Uruguay", "code": "UY"},
    {"name": "Uzbekistan", "code": "UZ"},
    {"name": "Vanuatu", "code": "VU"},
    {"name": "Venezuela (Bolivarian Republic of)", "code": "VE"},
    {"name": "Viet Nam", "code": "VN"},
    {"name": "Virgin Islands (British)", "code": "VG"},
    {"name": "Virgin Islands (U.S.)", "code": "VI"},
    {"name": "Wallis and Futuna", "code": "WF"},
    {"name": "Western Sahara", "code": "EH"},
    {"name": "Yemen", "code": "YE"},
    {"name": "Zambia", "code": "ZM"},
    {"name": "Zimbabwe", "code": "ZW"}
  ]

  useEffect(()=>{
    getToken()
  }, [])
  
  const searchRequestHandler = (searchValue, category) => {
    console.log(searchValue, category)
  }

  const passToBottom = (cartItems) =>{
    BottomCart.current.passDownItems(cartItems)
  }

  const removeFromCartHandler = (id) =>{
    childNav.current.removeItemHandler(id)
  }

  const clearNavCartState = () =>{
    childNav.current.clearCart()
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const RemoveFromCart = (id) =>{
    childNav.current.removeItemHandler(id)
  }

  const handleRadio = (state, value) =>{
    if(state === "delivery"){
      setDelivery({
        value: value
      })
    } else if (state === "payment"){
      setOrderBtn(value)
      setPayment({
        value: value
      })
    }
  }

  const createOrderObj = () =>{
    const price = orderItems.reduce((a, b)=> ({price: a.price + b.price})).price.toFixed(2)
    const totalPrice = Number(price) + Number(delivery.value)
    const order = {
      user: userAuth._id,
      items: orderItems,
      address,
      paymentMethod:payment.value,
      itemsPrice: price,
      shippingPrice: delivery.value,
      shippingMethod: delivery.value === 5 ? 'standard':'expedited',
      totalPrice,
    }
    return order
  }

  const createOrder = async(orderObj) =>{
    try {
      const config = {
        headers: {
          'Content-Type':'application/json',
        }
      }
      const {data} = await axios.post(`/api/v1/orders/`, orderObj, config)
        if(data){
          setData({...data, success:true, orderId:data._id})
          setActiveStep(5)
          setOrderItems([])
          emptyCart()
        }
      } catch (error) {
        console.error(error)
        setData({...data, error: error.message})
      }
  }

  const handleOrder = async () =>{
    if(payment.value === 'toCourier'){
      const orderObj = createOrderObj()
      createOrder(orderObj)
    } else if(payment.value === 'online'){
      handleNext()
    }
  }

  const showDropIn = () =>(
      <div>
        {
        data.clientToken !== null && 
          <div>
            <DropIn options={{
              authorization: data.clientToken,
              paypal:{
                flow: "vault"
              },
              card:{
                cardholderName:{
                  required: true
                }
              }
            }} onInstance={ instance =>(data.instance = instance)}/>
            <Button onClick={buy} className={classes.payBtn}>Pay</Button>
          </div>
        }
      </div>
  )

  const getToken = () =>{
    getBraintreeClientToken(cookie).then(data=>{
      if(data.error){
        setData({...data, error: data.error})
      } else {
        setData({clientToken: data.clientToken})
      }
    })
  }

  const buy = () =>{
    const price = orderItems.reduce((a, b)=> ({price: a.price + b.price})).price.toFixed(2)
    const totalPrice = Number(price) + Number(delivery.value)
    let nonce
    let getNonce = data.instance.requestPaymentMethod().then(data=>{
      nonce = data.nonce
      const paymentData = {
        paymentMethodNonce: nonce,
        amount: totalPrice
      }
      processPayment(cookie, paymentData)
      .then(response => {
        let orderObj = createOrderObj()
        const paymentResult = {
          transaction_id: response.transaction.id,
          amount: response.transaction.amount,
          status: response.success === true ? 'paid':'notPaid',
          email_address: userAuth.email,
          update_time: response.transaction.updatedAt,
        }
        orderObj.paymentResult = paymentResult
        orderObj.paidAt = response.transaction.updatedAt
        createOrder(orderObj)
      })
        .catch(error => {console.log(error); setData({...data, error: error.message})})
      })
      .catch(error=>{
        console.log('dropin error:', error)
        setData({...data, error: error.message})
      })
    }

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <>
            <div className={classes.stepContainer}>
              <Container maxWidth="xs">
                <form className={classes.stepOneform} onSubmit={(e)=> {e.preventDefault(); handleNext(); return false}}>
                  <FormControl required className={classes.formControl}>
                  <InputLabel id="select-category-label">Country/Region</InputLabel>
                    <Select
                      labelId="select-country-label"
                      id="select-country"
                      value={address.country}
                      onChange={(e)=> setAddress({...address, country:e.target.value})}>
                      {countries.map((country)=>(<MenuItem key={country.name} value={country.name}>{country.name}</MenuItem>))}
                    </Select>
                  </FormControl>
                  <TextField required type="text" label="Full name" value={address.fullName} onChange={(e)=> setAddress({...address, fullName: e.target.value})} />
                  <TextField required type="phone" label="Phone number" helperText="May be used to assist delivery" value={address.phoneNum} onChange={(e)=> setAddress({...address, phoneNum: e.target.value})}/>
                  <TextField required type="text" label="Postcode" value={address.zipCode} onChange={(e)=> setAddress({...address, zipCode: e.target.value})}/>
                  <TextField required type="text" label="Address line 1" value={address.addressLine1} onChange={(e)=> setAddress({...address, addressLine1: e.target.value})}/>
                  <TextField type="text" label="Address line 2 (optional)" value={address.addressLine2} onChange={(e)=> setAddress({...address, addressLine2: e.target.value})}/>
                  <TextField required type="text" label="Town/City" value={address.city} onChange={(e)=> setAddress({...address, city: e.target.value})}/>
                  <TextField type="text" label="County" value={address.county} onChange={(e)=> setAddress({...address, county: e.target.value})}/>
                  <TextField multiline={true} type="text" label="Add delivery instructions (optional)" value={address.comment} onChange={(e)=> setAddress({...address, comment: e.target.value})}/>
                  <input id='formsubmit' type="submit" className={classes.SubmitInput}/>
                </form>
              </Container>
              <div className={classes.btnGroup}>
                  <div>
                    <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                    <Button variant="contained" color="primary" className={classes.SubmitButton}>
                      <label htmlFor='formsubmit' className={classes.SubmitLabel}>
                        Next
                      </label>
                    </Button>
                  </div>
                </div>
            </div>
        </>
          )
      case 1:
        return (
          <>
            <div className={classes.stepContainer}>
              <Container maxWidth="sm">
                <div>
                  {orderItems.map((item)=> (
                    <div className={classes.cartItemContainer}>
                      <div className={classes.cartItemImageContainer}>
                        <Image src={`${item.image}`} alt={item.name} unsized={true} className={classes.cartItemImage}/>
                      </div>
                      <div>
                        <Link href={`/product/id?product=${item.id}`} underline={'none'}>
                          <Typography variant="subtitle2" color="textSecondary" component="p" className={classes.cartItemTitle}>
                            {item.name}
                          </Typography>
                        </Link>
                      </div>
                      <div className={classes.priceContainer}>
                        <Typography variant="subtitle2" color="textSecondary" component="p">
                          ${item.price}
                        </Typography>
                      </div>
                      <div className={classes.removeContainer}>
                        <IconButton aria-label="remove from cart" onClick={()=>{RemoveFromCart(item)}} >
                          <RemoveShoppingCartIcon />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
                <Divider variant="middle"/>
                <div className={classes.subtotalContainer}>
                  {orderItems.length > 0 && 
                    <>
                      <Typography variant="button" color="textSecondary" component="p">
                        {`Subtotal(${orderItems.length} items):`}
                      </Typography>
                      <Typography variant="button" color="textSecondary" component="p">
                        ${orderItems.reduce((a, b)=> ({price: a.price + b.price})).price.toFixed(2)}
                      </Typography>
                    </>
                  }
                </div>
              </Container>
              <div className={classes.btnGroup}>
                  <div>
                    <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                    <Button variant="contained" color="primary" className={classes.SubmitButton}>
                      <label htmlFor='formsubmit' className={classes.SubmitLabel} onClick={handleNext}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </label>
                    </Button>
                  </div>
                </div>
            </div>
        </>
          )
      case 2:
        return (
          <>
            <div className={classes.stepContainer}>
              <Container maxWidth="sm">
                <form onSubmit={(e)=> {e.preventDefault(); handleOrder(); return false}}>
                  <Typography variant="subtitle2" color="textSecondary" component="p">
                    Choose a delivery option:
                  </Typography>
                  <div className={classes.radioContainer}>
                    <div className={classes.radioOption}>
                      <input type="radio" id="standard" checked={delivery.value === 5} onChange={()=>handleRadio("delivery", 5)}/>
                      <label htmlFor="standard">$5.00 Standard Delivery</label>
                    </div>
                    <div className={classes.radioOption}>
                      <input type="radio" id="expedited" checked={delivery.value === 10} onChange={()=> handleRadio("delivery", 10)}/>
                      <label htmlFor="expedited">$10.00 Expedited Delivery</label>
                    </div>
                  </div>
                  <Divider variant="middle"/>
                  {orderItems.length > 0 &&
                    <div className={classes.total}>
                      <Typography variant="button" color="textSecondary" component="p">
                        Total:
                      </Typography>
                      <Typography variant="button" color="textSecondary" component="p">
                        ${Number(orderItems.reduce((a, b)=> ({price: a.price + b.price})).price.toFixed(2)) + Number(delivery.value)}
                      </Typography>
                    </div>
                  }
                  <Typography variant="subtitle2" color="textSecondary" component="p" style={{marginTop:'20px'}}>
                    Choose a payment option:
                  </Typography>
                  <div className={classes.radioContainer}>
                    <div className={classes.radioOption}>
                      <input type="radio" id="online" checked={payment.value === "online"} onChange={()=>handleRadio("payment", "online")}/>
                      <label htmlFor="online">Pay online</label>
                    </div>
                    <div className={classes.radioOption}>
                      <input type="radio" id="toCourier" checked={payment.value === "toCourier"} onChange={()=>handleRadio("payment", "toCourier")}/>
                      <label htmlFor="toCourier">Pay to courier</label>
                    </div>
                  </div>
                  <div className={classes.tos}>
                    <input type='checkbox' id='tos' name='tos' required/>
                    <label htmlFor='tos'>
                      <Typography variant="subtitle2" color="textSecondary" component="p">
                        {
                          'By placing your order you agree to our Conditions of Use & Sale. Please see our Privacy Notice and our Cookies Notice.'
                        }
                      </Typography>
                    </label>
                  </div>
                  <input id='placeOrderSubmit' type="submit" className={classes.SubmitInput}/>
                </form>
              </Container>
              <div className={classes.btnGroup}>
                  <div>
                    <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                      Back
                    </Button>
                    <Button variant="contained" color="primary" className={classes.SubmitButton}>
                      <label htmlFor='placeOrderSubmit' className={classes.SubmitLabel}>
                        {orderBtn === "online" ? 'Next' : 'Place order'}
                      </label>
                    </Button>
                  </div>
                </div>
            </div>
          </>
        )
      case 3: 
        return (
        <>
          <Container maxWidth="xs" className={classes.dropIn}>
            {showDropIn()}
          </Container>
          <Typography variant="caption text" color="textSecondary" component="p" className={classes.centerText}>
            Please use this card number: 2223000048400011
          </Typography>
          <div className={classes.btnGroup}>
            <div>
              <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                Back
              </Button>
            </div>
          </div>
        </>
        )
      default:
        return (
          <>
            <div className={classes.stepContainer}>
                <Container maxWidth="xs" className={classes.ThankYou}>
                  <div style={{paddingLeft:'50%', transform:'translateX(-40px)'}}>
                    <CheckCircleOutlineIcon style={{fill:'#4caf50', fontSize:'5rem'}}/>
                  </div>
                  <Typography variant="h6" color="textSecondary" component="p" className={classes.centerText}>
                    Thank you for your purchase!
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary" component="p" className={classes.centerText}>
                    Order ID:{data.orderId}
                  </Typography>
                </Container>
            </div>
          </>
        );
    }
  }

  return (
  <>
    <Head>
        <title>Checkout</title>
        <meta name="description" content='Place an order' />
        <link href="/globals.css" rel="stylesheet"/>
      </Head>
      <Navbar ref={childNav} User_name={userAuth && userAuth.name} trigger={searchRequestHandler} passToBottom={passToBottom} setCheckout={setOrderItems}/>
      <Container maxWidth="sm" className={classes.mainContainer}>
      {orderItems.length > 0 ? (
      <div className={classes.root}>
        <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
      </div>
      ):(
        <div className={classes.emptyContainer}>
          <Typography variant="h6" color="textSecondary" component="p" className={classes.centerText}>
            Your cart is empty!
          </Typography>
          <div className={classes.ctnShppngBtn}>
            <Link href={`/`} underline={'none'}>
              <Button variant="contained" color="primary"><Typography variant="subtitle2" component="p">Continue shopping</Typography></Button>
            </Link>
          </div>
        </div>
      )
      }
      
    </Container>
    <BottomNavbar ref={BottomCart} removeFromCartHandler={removeFromCartHandler} clearNavCartState={clearNavCartState} User_name={userAuth && userAuth.name}/>
  </>
  )
}

checkout.getInitialProps = async (cookie) => {
  return cookie
}

export default getCookie(checkout)