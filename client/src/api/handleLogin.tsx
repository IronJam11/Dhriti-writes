import axios from "axios";
import { BACKEND_ENDPOINT } from "../constants/endpoints";
import Cookies from 'js-cookie'
interface LoginData {
   email: string, 
   password: string,
}
export async function handleLogin(data: LoginData) {
    try {
      const response = await axios.post(`${BACKEND_ENDPOINT}/users/login/`, {data}, {
        headers: { "Content-Type": "application/json" },
      });
      const refreshToken = response.data['refresh-token'];
        const accessToken = response.data['access-token'];
        const username = response.data['username'];
        const name = response.data['name'];
        const id = response.data['id'];
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
        Cookies.set('name', name, {
        expires: 7,          
        path: '/',         
        sameSite: 'Lax',
        secure: true,   
        });
        Cookies.set('user_id', id, {
        expires: 7,          
        path: '/',         
        sameSite: 'Lax',
        secure: true,   
        });
    } catch (error) {
      console.error("Login Failed:", error);
      throw new Error("Login failed. Please check your credentials.");
    }
}  


