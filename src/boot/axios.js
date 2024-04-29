import { boot } from "quasar/wrappers";
import axios from "axios";
import router from "../router/index";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1/",
  withCredentials: true,
});

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.status === 401) {
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
