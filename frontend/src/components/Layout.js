import React from 'react';
import Sidebar from './Sidebar';
import '../assets/css/component/Layout.css'; 
const Layout = ({ children }) => {

  return (
    <div className="layout">
      <Sidebar  />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
