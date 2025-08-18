import React from 'react';
import Header from './Layout/Header';
import Footer from './Layout/Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
