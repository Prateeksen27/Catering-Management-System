import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // no need to repeat in store
  withCredentials: true, // if using cookies/JWT with credentials
});
