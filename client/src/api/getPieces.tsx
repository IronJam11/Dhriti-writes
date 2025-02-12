import axios from "axios";
import { BACKEND_ENDPOINT } from "../constants/endpoints";
import Cookies from 'js-cookie'

export async function getAdminPieces() {
    try {
      const accessToken = Cookies.get('accessToken');
      const response = await axios.post(`${BACKEND_ENDPOINT}/users/poetry/`,{
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


