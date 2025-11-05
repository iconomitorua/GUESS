// src/api/client.ts
import { handleError } from "@/utils/tools";
import axios, { AxiosRequestConfig } from "axios";
import axiosMiniprogramAdapter from "axios-miniprogram-adapter";

// 创建 axios 实例
const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "https://yxwdbapi.windoent.com/konami"
      : "https://yxwdbapi.windoent.com/konami",
  // @ts-ignore
  adapter: axiosMiniprogramAdapter,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 请求拦截器（等效于原 authLink）
apiClient.interceptors.request.use(async (config) => {
  let accessToken: any;
  const accessTokens = uni.getStorageSync("accessToken");
  const refreshToken = uni.getStorageSync("refreshToken");

  if (refreshToken == "" || (accessTokens == "" && refreshToken !== "")) {
    accessToken = refreshToken;
  } else {
    accessToken = accessTokens;
  }
  if (accessToken) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

export let apiClientFn = apiClient;
// 使用更精确的类型定义
export async function clientPost(
  url: any,
  data: any,
  config?: AxiosRequestConfig
) {
  try {
    const response = await apiClient.post(url, data, config);
    if (response.data.code === 200) {
      return response.data;
    } else {
      handleError(response.data.msg);
      return response.data;
      // throw response.data.msg;
    }
  } catch (error: any) {
    handleError(error);
    throw error; // 改为抛出错误而不是返回
  }
}

export async function clientGet(
  url: any,
  data: any,
  config?: AxiosRequestConfig
) {
  try {
    const response = await apiClient.get(url, data);
    if (response.data.code === 200) {
      return response.data;
    } else {
      handleError(response.data.msg);
      throw response.data.msg;
    }
  } catch (error: any) {
    handleError(error);
    throw error; // 改为抛出错误而不是返回
  }
}

export type ClientPostFunction = typeof clientPost;

export type ClientGetFunction = typeof clientGet;

export const thtmeColor = "#cd1800";
