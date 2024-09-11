import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from "./services/auth.service";
import EventBus from "./common/EventBus";
import Register from "./views/Register";
import Products from "./views/Products";
import Layout from "./components/Layout";
import Login from "./views/login";

class App extends Component {
  componentDidMount() {
    EventBus.on("logout", this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    AuthService.logout();
    window.location.reload();
  }

  render() {
    // Get the current user from local storage using AuthService
    const currentUser = AuthService.getCurrentUser();

    return (
      <div>
        <Routes>
          {currentUser ? (
            <>
              <Route path="/" element={<Layout><Products /></Layout>} />
              <Route path="/products" element={<Layout><Products /></Layout>} />
            </>
          ) : (
            <>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
        </Routes>
        <ToastContainer />
      </div>
    );
  }
}

export default App;
