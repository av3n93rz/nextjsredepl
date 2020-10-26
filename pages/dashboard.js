import React from 'react';
import PrivateRoute from '../Components/PrivateRoute';
import axios from 'axios'
import Head from 'next/head'
import Navbar from '../Components/Navbar'

const Dashboard = (props) => {
  console.log(props)
return <>
<Head>
    <title>Home Screen</title>
  </Head>
<Navbar pageTitle={"Dashboard"}/>
</>
};

export default PrivateRoute(Dashboard);