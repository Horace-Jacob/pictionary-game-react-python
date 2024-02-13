import axios from "axios";

export const SERVER_ENDPOINT = process.env.REACT_APP_SERVER_API_URL;
export const CLIENT_ENDPOINT = process.env.REACT_APP_CLIENT_API_URL;

export const handleLogin = () => {
  try {
    window.open(`${SERVER_ENDPOINT}/login`, "_self");
  } catch (error) {
    console.log(error);
  }
};

export const handleUsers = async () => {
  try {
    const url = `${SERVER_ENDPOINT}/users`;
    const response = await axios.get(url, { withCredentials: true });
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
