import axios from "axios";
import { BACKEND_ENDPOINT } from "../constants/endpoints";
import Cookies from 'js-cookie';
interface OTPVerificationData {
    otp: string;
    otp_id: string;
    user_id: string;
}
export async function handleOTPVerification(data: OTPVerificationData,navigate: any) {
    try {
      const response = await axios.post(`${BACKEND_ENDPOINT}/users/login/`, {data}, {
        headers: { "Content-Type": "application/json" },
      });
      const refreshToken = response.data['refresh-token'];
      const accessToken = response.data['access-token'];
      const username = response.data['username'];
      Cookies.set('accessToken', accessToken, {
        expires: 1,         
        path: '/',           
        sameSite: 'Lax',     
        secure: true,        
      });
      Cookies.set('refreshToken', refreshToken, {
        expires: 7,        
        path: '/',        
        sameSite: 'Lax',
        secure: true,      
      });
      Cookies.set('username', username, {
        expires: 7,          
        path: '/',         
        sameSite: 'Lax',
        secure: true,   
      });
      navigate('/');
    } catch (error) {
      console.error("Login Failed:", error);
      alert("Invalid credentials!!!");
      throw new Error("Login failed. Please check your credentials.");
    }
} 