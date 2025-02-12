import axios from "axios";
import { BACKEND_ENDPOINT } from "../constants/endpoints";
import Cookies from 'js-cookie'
interface User {
    email: string;
    name: string;
    username: string;
    bio?: string;
    profile_picture?: string;
    date_joined: string;
  }
  export async function patchUserDetails(formData: FormData) {
    console.log("proposed name", formData.get('name'));
    try {
        const accessToken = Cookies.get('accessToken');
        const response = await axios.patch(
            `${BACKEND_ENDPOINT}/users/whoami/`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'multipart/form-data' 
                }
            }
        );
        return response;
    } catch (error) {
        console.error("Update Failed:", error);
        throw new Error("Update failed. Please try again.");
    }
}


