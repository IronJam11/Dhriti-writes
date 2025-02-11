import axios from "axios";
import { BACKEND_ENDPOINT } from "../constants/endpoints";
interface OTPVerificationData {
    otp: string;
    otp_id: string;
    user_id: string;
}
export async function handleOTPVerification(data: OTPVerificationData) {
    try {
      const response = await axios.post(`${BACKEND_ENDPOINT}/users/register/`, {...data,  action: 'verify_otp'}, {
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 200 || response.status === 201) {
        console.log("Login Successful:", response.data);
        alert("Hellew fellow poet, you have been registered successfully. You can now login.");
        return response.data;
      }
    } catch (error) {
      console.error("Login Failed:", error);
      throw new Error("Login failed. Please check your credentials.");
    }
} 