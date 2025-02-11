import axios from 'axios';
import { BACKEND_ENDPOINT } from '../constants/endpoints';
interface LoginData {
    email: string;
    password: string;
}
export async function handleOTPVerification(data: LoginData) {
    try {
      const response = await axios.post(`${BACKEND_ENDPOINT}/users/register/`, {...data}, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200 || response.status === 201) {
        console.log("Login Successful:", response.data);
        
        alert("Hellew fellow poet, you have been logged in successfully !");
        return response.data;
      }
    } catch (error) {
      console.error("Login Failed:", error);
      throw new Error("Login failed. Please check your credentials.");
    }
} 