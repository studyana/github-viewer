import { GitHubAPIError } from "@/types/github";
import axios, { AxiosError } from "axios";
const BASE_URL = "https://api.github.com";
const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/vnd.github.v3+json",
    Authorization: `${process.env.REACT_APP_GITHUB_TOKEN}`,
  },
});
// 请求拦截器
request.interceptors.request.use((config) => {
  console.log(`Requesting: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});
// 响应拦截器
request.interceptors.response.use(
  (response) => response,
  (error: AxiosError<GitHubAPIError>) => {
    if (error.response) {
      console.error("GitHub API Error:", error.response.data);

      // 处理速率限制
      if (
        error.response.status === 403 &&
        error.response.headers["x-ratelimit-remaining"] === "0"
      ) {
        const resetTime = new Date(
          Number(error.response.headers["x-ratelimit-reset"]) * 1000
        );
        const message = `GitHub API rate limit exceeded. Reset at ${resetTime.toLocaleTimeString()}`;
        return Promise.reject(new Error(message));
      }

      return Promise.reject(
        new Error(error.response.data.message || "GitHub API request failed")
      );
    }
    return Promise.reject(error);
  }
);
export default request;
