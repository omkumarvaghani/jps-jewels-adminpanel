import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_API;

const getToken = () => {
  const adminToken = localStorage.getItem("authorization");
  return adminToken ? adminToken : null;
};

const getId = () => {
  const adminId = localStorage.getItem("id");
  return adminId ? adminId : null;
};

const AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

AxiosInstance.interceptors.request.use(
  async (config) => {
    const token = getToken();
    const id = getId();
    if (token && id) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["id"] = `Bearer ${id}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AxiosInstance;
