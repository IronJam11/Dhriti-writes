import axios from "axios";
import { BACKEND_ENDPOINT } from "../constants/endpoints";
interface RegisterData {
    username: string;
    email: string;
    password: string;
    name:string;
}
export async function handleRegister(data: RegisterData) {
    try {
      const response = await axios.post(`${BACKEND_ENDPOINT}/users/register/`, {...data,  action: 'register'}, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200 || response.status === 201) {
        console.log("Registration Successful:", response.data);
        alert("Hellew fellow poet, you have been registered successfully. You are sent an otp, please check your inbox :)");
        return response.data;
      }
    } catch (error) {
      console.error("Login Failed:", error);
      throw new Error("Login failed. Please check your credentials.");
    }
}  


