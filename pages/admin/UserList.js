import React, {useState, useEffect} from 'react';
import Head from 'next/head'
import { makeStyles} from '@material-ui/core/styles';
import ListUsers from '../../Components/hocs/ListUsers'
import PrivateRoute from '../../Components/hocs/PrivateRoute';
import {Container} from '@material-ui/core';
import Navbar from '../../Components/Navbar'
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import EnhancedTable from '../../Components/AdminUserListTable'
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

const UserList = ({users, userAuth}) => {
  const classes = useStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const [prodsState, setProdsState] = useState(users);
  const [searchCol, setSearchCol] = useState('name');
  const [notanum, setNotanum] = useState(false);

  
  const passToBottom = () =>{
    return
  }

  const searchRequestHandler = (searchValue, category) => {
    console.log(searchValue, category)
  }

  return (
    <>
    <Head>
        <title>Admin | List Users</title>
      <meta name="description" content='A list of the Users in the system. You can edit and delete them here.' />
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
            <MenuItem key={'name'} value={'name'}>Name</MenuItem>
            <MenuItem key={'_id'} value={'_id'}>Id</MenuItem>
            <MenuItem key={'email'} value={'email'}>Email</MenuItem>
          </Select>
        </FormControl>
      </div>
      <EnhancedTable users={searchQuery ? searchCol === 'name' ?
        prodsState.filter(el=> el[searchCol].toLowerCase().includes(searchQuery.toLowerCase()))
        :
        searchCol === 'email' ?  prodsState.filter(el=> el[searchCol].toLowerCase().includes(searchQuery.toLowerCase()))
        :
        searchCol === '_id' ? prodsState.filter(el=> el[searchCol].toLowerCase().includes(searchQuery.toLowerCase()))
        :
        prodsState
        :
        prodsState
        } setDeleteState={setProdsState}/>
    </Container>
    </>
  );
}

UserList.getInitialProps = async (users) => {
  return users
}

export default PrivateRoute(ListUsers(UserList))

