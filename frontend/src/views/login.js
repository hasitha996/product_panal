import React, { Component } from "react";
import { Link } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import { withRouter } from "../common/with-router";
import styles from "../assets/css/page/Login.module.css"; // Use module CSS

const required = value => {
  if (!value) {
    return (
      <div className="text-danger text-center">
        This field is required!
      </div>
    );
  }
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      username: "",
      password: "",
      loading: false,
      message: ""
    };
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

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  handleLogin(e) {
    e.preventDefault();

    this.setState({
      message: "",
      loading: true
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.login(this.state.username, this.state.password).then(
        () => {
          this.props.router.navigate("/products");
          window.location.reload();
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            loading: false,
            message: resMessage
          });
        }
      );
    } else {
      this.setState({
        loading: false
      });
    }
  }

  render() {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.backgroundImage}>
          <div className={styles.overlay}></div>
        </div>

        <div className={styles.loginForm}>
          <div className={`card p-4 shadow-lg border-0 rounded ${styles.card}`}>
            <h2 className="text-center mb-4">Login</h2>
            <Form
              onSubmit={this.handleLogin}
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
                  className={`btn btn-block mb-2 ${styles.btnPrimary}`}
                  disabled={this.state.loading}
                >
                  {this.state.loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Login</span>
                </button>
              </div>

              {this.state.message && (
                <div className="form-group">
                  <div className="alert alert-danger text-center" role="alert">
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
              <Link to="/register" className="btn btn-link">
                Don't have an account? Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
