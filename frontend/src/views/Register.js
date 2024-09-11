import React, { Component } from "react";
import Form from "react-validation/build/form";
import { Link } from "react-router-dom";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import { withRouter } from "../common/with-router";
import styles from "../assets/css/page/Register.module.css"; // Use module CSS

const required = value => {
  if (!value) {
    return (
      <div className="text-danger text-center">
        This field is required!
      </div>
    );
  }
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      successful: false,
      message: "",
      loading: false // Added loading state
    };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleRegister(e) {
    e.preventDefault();
  
    this.setState({
      message: "",
      successful: false,
      loading: true // Set loading to true
    });
  
    this.form.validateAll();
  
    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(
        this.state.username,
        this.state.email,
        this.state.password
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true,
            loading: false // Set loading to false
          });
  
          // Navigate to login after successful registration
          this.props.router.navigate("/login");
          
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
  
          this.setState({
            successful: false,
            message: resMessage,
            loading: false // Set loading to false
          });
        }
      );
    } else {
      this.setState({
        loading: false // Set loading to false
      });
    }
  }
  

  componentDidMount() {
    this.startImageRotation();
  }

  startImageRotation() {
    const images = [
      'https://cdn.pixabay.com/photo/2021/01/05/06/40/boat-5889919_1280.png',
      'https://cdn.pixabay.com/photo/2016/06/02/02/33/triangles-1430105_1280.png',
      'https://cdn.pixabay.com/photo/2021/09/08/02/39/mountains-6605282_960_720.png'
    ];
    let currentImageIndex = 0;
    const imageElement = document.querySelector(`.${styles.backgroundImage}`);

    if (imageElement) {
      setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        imageElement.style.backgroundImage = `url(${images[currentImageIndex]})`;
      }, 5000); // Change image every 5 seconds
    }
  }

  render() {
    return (
      <div className={styles.registerContainer}>
        <div className={styles.backgroundImage}>
          <div className={styles.overlay}></div>
        </div>

        <div className={styles.registerForm}>
          <div className={`card p-4 shadow-lg border-0 rounded ${styles.card}`}>
            <h2 className="text-center mb-4">Register</h2>
            <Form
              onSubmit={this.handleRegister}
              ref={c => {
                this.form = c;
              }}
            >
              <div className={styles.formGroup}>
                <label htmlFor="username">Username</label>
                <Input
                  type="text"
                  className={`form-control ${styles.formControl}`}
                  name="username"
                  value={this.state.username}
                  onChange={this.onChangeUsername}
                  validations={[required]}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  className={`form-control ${styles.formControl}`}
                  name="email"
                  value={this.state.email}
                  onChange={this.onChangeEmail}
                  validations={[required]}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  className={`form-control mb-3 ${styles.formControl}`}
                  name="password"
                  value={this.state.password}
                  onChange={this.onChangePassword}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <button
                  className={`btn btn-block ${styles.btnPrimary}`}
                  disabled={this.state.loading}
                >
                  {this.state.loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Register</span>
                </button>
              </div>

              {this.state.message && (
                <div className="form-group">
                  <div className={
                    this.state.successful
                      ? `alert alert-success ${styles.alert}`
                      : `alert alert-danger ${styles.alert}`
                  } role="alert">
                    {this.state.message}
                  </div>
                </div>
              )}
              <CheckButton
                style={{ display: "none" }}
                ref={c => {
                  this.checkBtn = c;
                }}
              />
            </Form>
            <div className="text-center mt-3">
              <Link to="/login" className="btn btn-link">Already have an account? Login</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);
