import axios from "axios";
import { getItem } from "./LocalStorage.Service";

const api = axios.create({
  baseURL: "https://harness-559519829208.asia-south1.run.app/api",
});

api.interceptors.request.use(
  (config) => {
    const token = getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
//Auth/token