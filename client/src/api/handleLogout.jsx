import axios from 'axios';
import Cookies from 'js-cookie'
import BACKEND_ENDPOINT from '../constants/endpoints';
export const handleLogout = async (navigate) => {
    const refreshToken = Cookies.get('refreshToken');
  try {
    const response = await axios.post(`${BACKEND_ENDPOINT}/users/logout/`, {
      refresh_token: refreshToken 
    }, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${Cookies.get('accessToken')}`,
      }
    });
    console.log("response", response.data);
    Cookies.remove('accessToken'); 
    Cookies.remove('refreshToken');
    Cookies.remove('jwt');
    Cookies.remove('username');
    alert("You have successfully logged out!");
    navigate('/loginpage');
  } catch (err) {
    console.error('Error during logout:', err.response ? err.response.data : err.message);
  }
};
export default handleLogout;
