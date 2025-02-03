import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API,
});

console.log(process.env.REACT_APP_BASE_API,"AxiosInstance")

export default AxiosInstance;
