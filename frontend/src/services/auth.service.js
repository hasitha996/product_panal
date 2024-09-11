import axios from "axios";
import CryptoJS from "crypto-js";
import authHeader from './auth.header';
const API_URL = process.env.REACT_APP_API_URL;

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + "auth/signin", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(response.data), 'auth-users').toString();
          localStorage.setItem("user", encryptedData);
        }

        return response.data;
      });
  }

  async logout() {
    try {
      // Make the signout request
      await axios.get(API_URL + 'auth/signout', { headers: authHeader() });

      // Remove the user data from localStorage after the API call is successful
      localStorage.removeItem("user");
      return true;
    } catch (error) {
      console.error("Error during logout", error);
      // localStorage.removeItem("user");
      return false;
    }
  }


  register(username, email, password) {
    return axios.post(API_URL + "auth/signup", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    const encryptedData = localStorage.getItem("user");

    if (encryptedData) {
      // Decrypt the user data
      const bytes = CryptoJS.AES.decrypt(encryptedData, 'auth-users');
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      return decryptedData;
    }

    return null;
  }
}

export default new AuthService();
