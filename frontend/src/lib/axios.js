import axios from "axios";

// Remove the trailing /auth from the string! Keep it exactly like this:
const BASE_URL = "https://fluentoapp.onrender.com/api"; 

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Crucial for cross-domain cookies
});
