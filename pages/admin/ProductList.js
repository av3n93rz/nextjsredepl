import React, {useState, useEffect} from 'react';
import Head from 'next/head'
import { makeStyles} from '@material-ui/core/styles';
import ListAdminProducts from '../../Components/hocs/ListAdminProducts'
import PrivateRoute from '../../Components/hocs/PrivateRoute';
import {Container} from '@material-ui/core';
import Navbar from '../../Components/Navbar'
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import EnhancedTable from '../../Components/AdminProductListTable'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Alert from '@material-ui/lab/Alert';

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

const ProductList = ({products, userAuth}) => {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const [prodsState, setProdsState] = useState(products);
  const [searchCol, setSearchCol] = useState('name');
  const [notanum, setNotanum] = useState(false);

  useEffect(()=>{
    if((searchCol === 'rating' || searchCol === 'countInStock' || searchCol === 'price') && (isNaN(searchQuery))){
      setNotanum(true)
    } else {
      setNotanum(false)
    }
  }, [searchQuery, searchCol])

  return (
    <>
    <Head>
        <title>Admin | List Products</title>
      <meta name="description" content='A list of the products in the system. You can edit and delete them here.' />
    </Head>
    <Navbar User_name={userAuth && userAuth.name}/>
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
            <MenuItem key={'name'} value={'name'}>Name</MenuItem>
            <MenuItem key={'category'} value={'category'}>Category</MenuItem>
            <MenuItem key={'brand'} value={'brand'}>Brand</MenuItem>
            <MenuItem key={'rating'} value={'rating'}>Rating</MenuItem>
            <MenuItem key={'countInStock'} value={'countInStock'}>Count In Stock</MenuItem>
            <MenuItem key={'price'} value={'price'}>Price</MenuItem>
          </Select>
        </FormControl>
      </div>
      <EnhancedTable products={searchQuery ? searchCol === 'name' ?
        prodsState.filter(el=> el[searchCol].toLowerCase().includes(searchQuery.toLowerCase()))
        :
        searchCol === 'brand' ? prodsState.filter(el=> el[searchCol].name.toLowerCase().includes(searchQuery.toLowerCase()))
        :
        searchCol === 'category' ? prodsState.filter(el=> el[searchCol].name.toLowerCase().includes(searchQuery.toLowerCase()))
        :
        searchCol === 'rating' ? isNaN(searchQuery) ? prodsState : prodsState.filter(el=> el[searchCol].toString().startsWith(searchQuery))
        :
        searchCol === 'countInStock' ? isNaN(searchQuery) ? prodsState : prodsState.filter(el=> el[searchCol].toString().startsWith(searchQuery))
        :
        searchCol === 'price' ? isNaN(searchQuery) ? prodsState : prodsState.filter(el=> el[searchCol].toString().startsWith(searchQuery))
        :
        prodsState
        :
        prodsState
        } setDeleteState={setProdsState}/>
    </Container>
    </>
  );
}

ProductList.getInitialProps = async (products) => {
  return products
}

export default PrivateRoute(ListAdminProducts(ProductList))

