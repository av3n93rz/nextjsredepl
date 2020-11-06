import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import {isLoggedIn} from '../backend/Controllers/authController'
import App, { AppProps, AppContext } from 'next/app'

export default function MyApp(props) {
  const { Component, pageProps} = props;


  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);


  return (
    <React.Fragment>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  );
}

MyApp.getInitialProps = async (AppContext) => {
  const appProps = await App.getInitialProps(AppContext)
  const req = AppContext.ctx.req
  let userAuth
  if(req.cookies.jwt){
    const checkUserAuthentication = async (jwt_token) => {
      const loggedInUser = await isLoggedIn(jwt_token)
      return loggedInUser
    };
    userAuth = await checkUserAuthentication(req.cookies.jwt)
  }

  return {
    pageProps: {
      ...appProps.pageProps,
      userAuth
    },
  }
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
