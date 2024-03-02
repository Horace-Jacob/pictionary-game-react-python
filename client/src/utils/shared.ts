import { jwtDecode } from "jwt-decode";
import { JwtType } from "./types";
import { toast } from "react-toastify";

export const isAuth = () => {
  const token = localStorage.getItem("token");
  return token !== null;
};

export const generateRandomCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

export const getUsername = () => {
  const token = localStorage.getItem("token");
  if (token !== null) {
    const decodedValue: JwtType = jwtDecode(token);
    return decodedValue.name;
  }
};

export const getUserID = () => {
  const token = localStorage.getItem("token");
  if (token !== null) {
    const decodedValue: JwtType = jwtDecode(token);
    return decodedValue.id;
  }
};

export const getUserEmail = () => {
  const token = localStorage.getItem("token");
  if (token !== null) {
    const decodedValue: JwtType = jwtDecode(token);
    return decodedValue.email;
  }
};

export const getUserPicture = () => {
  const token = localStorage.getItem("token");
  if (token !== null) {
    const decodedValue: JwtType = jwtDecode(token);
    return decodedValue.picture;
  }
};

export const notify = (message: string) => toast(message);

export const gameEventNotify = (message: string) =>
  toast(message, {
    position: "top-center",
    draggable: true,
    closeButton: false,
    theme: "dark",
    hideProgressBar: true,
    autoClose: 500,
  });
