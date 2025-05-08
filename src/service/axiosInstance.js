import axios from "axios";
import { AUTH_TOKEN, BASE_URL } from "../constant";
import { navigateTo } from "../utils/navigate";

// remove the CORS proxy once the CORS error is fixed
export const apiAUTH = axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
});

export const apiFormDataAUTH = axios.create({
  baseURL:BASE_URL,
  timeout:10000,
  headers: {
      "Content-Type":"multipart/form-data"
    },
});

export const api = axios.create({
    baseURL: BASE_URL,
    timeout:10000,
    headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json",
      },
})

apiAUTH.interceptors.request.use((config)=>{
    const token =localStorage.getItem(AUTH_TOKEN);
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiAUTH.interceptors.response.use((response)=>{
    return response
  }, function (error) {
    if(error?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN)
      navigateTo("/login")
    } else return error
    console.log('erroreeeeeeeeeeeeee', error)
  });

  apiFormDataAUTH.interceptors.request.use((config)=>{
    const token =localStorage.getItem(AUTH_TOKEN);
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiFormDataAUTH.interceptors.response.use((response)=>{
    return response
  }, function (error) {
    if(error?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN)
      navigateTo("/login")
    } else return error
    console.log('erroreeeeeeeeeeeeee', error)
  });