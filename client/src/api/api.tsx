import axios from "axios";

export const SERVER_ENDPOINT = "http://127.0.0.1:5000";
export const CLIENT_ENDPOINT = "http://localhost:3000";

export const handleLogin = () => {
  try {
    window.open(`${SERVER_ENDPOINT}/login`, "_self");
  } catch (error) {
    console.log(error);
  }
};

export const handleProfile = async () => {
  try {
    const url = `${SERVER_ENDPOINT}/me`;
    const response = await axios.get(url);
    const data = response.data;
    console.log(data);
    return data;
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
