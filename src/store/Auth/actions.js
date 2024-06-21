// src/utils/auth.js
import axios from "axios";
import { LocalStorage } from "quasar";
import { useRouter } from "vue-router";

export const setResult = (data) => {
  localStorage.setItem("token", data.token);
};

export const fetchAuthUser = () => {
  return axios.get("http://127.0.0.1:8000/api/authuser", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const login = (loginForm) => {
  return axios
    .post("http://127.0.0.1:8000/api/login", loginForm)
    .then((response) => {
      const data = response.data;
      if (response.status === 200) {
        setResult(data);
        return fetchAuthUser();
      }
      throw new Error("Login failed");
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      throw error;
    });
};

export const setupAuthInterceptors = (api) => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        LocalStorage.remove("token");
        const router = useRouter();
        router.push({ path: "/login" });
      }
      return Promise.reject(error);
    }
  );
};
export function logout() {
  const token = LocalStorage.getItem("token");

  return new Promise((resolve, reject) => {
    axios
      .post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        LocalStorage.remove("token");
        resolve(response);
      })
      .catch((error) => {
        LocalStorage.remove("token");
        reject(error);
      });
  });
}
