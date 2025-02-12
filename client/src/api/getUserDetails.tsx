import axios from "axios";
import { BACKEND_ENDPOINT } from "../constants/endpoints";
import Cookies from 'js-cookie'

export async function getUserDetails() {
    try {
      const accessToken = Cookies.get('accessToken');
      const response = await axios.get(`${BACKEND_ENDPOINT}/users/whoami/`,{
        headers: {
            'Authorization': `Bearer ${accessToken}`  // Send token as a header
          }
        }
        );
     return response;
    } catch (error) {
      console.error("Login Failed:", error);
      throw new Error("Login failed. Please check your credentials.");
    }
}  


