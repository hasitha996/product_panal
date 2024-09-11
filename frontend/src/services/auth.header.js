import CryptoJS from "crypto-js";

export default function authHeader() {
  const encryptedData = localStorage.getItem('user');

  if (encryptedData) {
    try {
      // Decrypt the user data
      const bytes = CryptoJS.AES.decrypt(encryptedData, 'auth-users');
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      // Check if accessToken exists and return appropriate header
      if (decryptedData && decryptedData.accessToken) {
        // return { Authorization: 'Bearer ' + decryptedData.accessToken }; // for Spring Boot back-end
        return { 'x-access-token': decryptedData.accessToken }; // for Node.js Express back-end
      }
    } catch (error) {
      console.error("Error decrypting the token", error);
      return {}; // Return an empty object if decryption fails
    }
  }

  return {};
}
