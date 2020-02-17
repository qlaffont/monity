/* eslint-disable react/prop-types */
import React from 'react';
import Head from 'next/head';

import './app.scss';
import AuthProvider from '../services/auth/authContext';

const MyApp = (props): JSX.Element => {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <title>Monity</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/fontawesome.min.css"
          integrity="sha256-mM6GZq066j2vkC2ojeFbLCcjVzpsrzyMVUnRnEQ5lGw="
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/regular.min.css"
          integrity="sha256-Pd28JXamAUfl4NS9QzGAdbaqdPQGG9dKLj3caGj28fg="
          crossOrigin="anonymous"
        />

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/solid.min.css" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
};

export default MyApp;
