import React, {useState, useEffect} from 'react';
import Head from 'next/head'
import { makeStyles} from '@material-ui/core/styles';
import PrivateRoute from '../../../Components/hocs/PrivateRoute';
import {Container} from '@material-ui/core';
import Navbar from '../../../Components/Navbar'
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Alert from '@material-ui/lab/Alert';
import TableChips from '../../../Components/TableChips'
import ListAdminOrders from '../../../Components/hocs/ListAdminOrders'
import EnhancedTable from '../../../Components/AdminOrderListTable'



const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '50px'
  },
  searchArea:{
    width: '100%',
    marginBottom: '50px',
    display: 'flex',
    justifyContent: 'center',
  },
  searchField:{
    margin:'0 20px'
  },
  infoBar:{
    marginBottom: '25px'
  },
}));

const OrderList = ({orders, userAuth, statusValues}) => {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const [ordsState, setOrdsState] = useState(orders.orders);
  const [searchCol, setSearchCol] = useState('_id');
  const [notanum, setNotanum] = useState(false);
  const [display, setDisplay] = React.useState({
    id: {disp:true, title: 'Id'},
    itemsPrice: {disp:true, title: 'Items Price'},
    totalPrice: {disp:true, title: 'Total Price'},
    paymentMethod: {disp:true, title: 'Payment Method'},
    paymentResult: {disp:true, title: 'Payment Status'},
    shippingMethod: {disp:true, title: 'Shipping'},
    status: {disp:true, title: 'Status'},
    userId: {disp:true, title: 'User'},
  });


  useEffect(()=>{
    if((searchCol === 'itemsPrice' || searchCol === 'totalPrice') && (isNaN(searchQuery))){
      setNotanum(true)
    } else {
      setNotanum(false)
    }
  }, [searchQuery, searchCol])

  const passToBottom = () =>{
    return
  }

  const searchRequestHandler = (searchValue, category) => {
    console.log(searchValue, category)
  }
  
  const handleDelete = (key) =>{
    setDisplay({...display, [key]:{title:display[key].title, disp: false}})
  }
  const handleDisplay = (key) =>{
    setDisplay({...display, [key]:{title:display[key].title, disp: true}})
  }

  const setOrderStatus = (idArray, status) =>{
    let newOrders = ordsState
    for(const item of idArray){
      const orderIndex = newOrders.findIndex(obj => obj._id === item)
      if(orderIndex >= 0){
        newOrders[orderIndex].status = status
      }
    }
    setOrdsState([...newOrders])
  }

  return (
    <>
    <Head>
        <title>Admin | List Orders</title>
      <meta name="description" content='A list of the orders in the system. You can edit and delete them here.' />
    </Head>
    <Navbar user={userAuth && userAuth} trigger={searchRequestHandler} passToBottom={passToBottom}/>
    <Container maxWidth="md" className={classes.container}>
      {notanum && <Alert variant="filled" color="error" severity="error" className={classes.infoBar}>Not a number!</Alert>}
      <div className={classes.searchArea}>
        <TextField type="text" label="Search..." value={searchQuery} className={classes.searchField} onChange={e => setSearchQuery(e.target.value)}/>
        <FormControl className={classes.formControl, classes.searchField}>
          <InputLabel id="select-search-col-label">Column</InputLabel>
          <Select
            labelId="select-search-col-label"
            id="select-search-col"
            value={searchCol}
            onChange={(e)=> setSearchCol(e.target.value)}>
            <MenuItem key={'_id'} value={'_id'}>Id</MenuItem>
            <MenuItem key={'itemsPrice'} value={'itemsPrice'}>Items Price</MenuItem>
            <MenuItem key={'totalPrice'} value={'totalPrice'}>Total Price</MenuItem>
            <MenuItem key={'paymentMethod'} value={'paymentMethod'}>Payment Method</MenuItem>
            <MenuItem key={'paymentResult'} value={'paymentResult'}>Payment Status</MenuItem>
            <MenuItem key={'shippingMethod'} value={'shippingMethod'}>Shipping Method</MenuItem>
            <MenuItem key={'status'} value={'status'}>Status</MenuItem>
            <MenuItem key={'user'} value={'user'}>User Id</MenuItem>
          </Select>
        </FormControl>
      </div>
      <TableChips chips={display} handleDelete={handleDelete} handleDisplay={handleDisplay} returnTag={'id'} />
      <EnhancedTable orders={searchQuery ? 
        searchCol === 'shippingMethod' ? ordsState.filter(el=> el[searchCol].toLowerCase().includes(searchQuery.toLowerCase()))
        :
        searchCol === 'paymentMethod' ? ordsState.filter(el=> el[searchCol].toLowerCase().startsWith(searchQuery.toLowerCase()))
        :
        searchCol === 'paymentResult' ? ordsState.filter(el=> el[searchCol].status.toLowerCase().startsWith(searchQuery.toLowerCase()))
        :
        searchCol === 'status' ? ordsState.filter(el=> el[searchCol].toLowerCase().startsWith(searchQuery.toLowerCase()))
        :
        searchCol === '_id' ?  ordsState.filter(el=> el[searchCol].toLowerCase().includes(searchQuery.toLowerCase()))
        :
        searchCol === 'user' ? ordsState.filter(el=> el[searchCol]._id.toLowerCase().includes(searchQuery.toLowerCase()))
        :
        searchCol === 'totalPrice' ? isNaN(searchQuery) ? ordsState : ordsState.filter(el=> el[searchCol].toString().startsWith(searchQuery))
        :
        searchCol === 'itemsPrice' ? isNaN(searchQuery) ? ordsState : ordsState.filter(el=> el[searchCol].toString().startsWith(searchQuery))
        :
        ordsState
        :
        ordsState
        } setDeleteState={setOrdsState} setOrderStatus={setOrderStatus} display={display} statusValues={statusValues}/>
    </Container>
    </>
  );
}

OrderList.getInitialProps = async (orders, statusValues) => {
  return {orders, statusValues}
}

export default PrivateRoute(ListAdminOrders(OrderList))

