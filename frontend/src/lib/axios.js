import axios from "axios";

const BASE_URL = 
  import.meta.env.VITE_API_URL || 
  "https://fluentoapp.onrender.com/api/auth"; 

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, 
});
