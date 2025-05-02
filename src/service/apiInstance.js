import { api, apiAUTH } from "./axiosInstance";

// no auth token required
export const getAPI = async (url, body) => {
  const response = await api.get(url, body);
  return response;
};

// auth token required
export const getAPIAuth = async (url) => {
    const response = await apiAUTH.get(url);
    return response;
};

// no auth token required
export const postAPI = async (url, params) => {
  const response = await api.post(url, params);
  return response;
};

// auth token required
export const postAPIAuth = async (url, params) => {
    const response = await apiAUTH.post(url, params);
    return response;
};

// auth token required
export const formDataAuth = async (url, params) => {
    const response = await apiAUTH.post(url, params,{
      "Content-Type":"multipart/form-data"
    });
    return response;
};