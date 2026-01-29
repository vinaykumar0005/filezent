import axios from "axios";

const api = axios.create({
  baseURL: "https://filezent.onrender.com/api",
});

export default api;
