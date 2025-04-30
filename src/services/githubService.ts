import request from "@/utils/request";
import {
  GitHubBranch,
  GitHubRepo,
  RepoContentItem,
  RepoFileContent,
} from "@/types/github";
import axios, { AxiosResponse } from "axios";
import { GitHubRepoDetail } from "@/types/github";
const getUserRepos = async (username: string) => {
  try {
    let allRepos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100; // GitHub API 每页最大允许值

    while (true) {
      const response: AxiosResponse<GitHubRepo[]> = await request.get(
        `/users/${username}/repos`,
        {
          params: {
            sort: "updated",
            direction: "desc",
            page,
            per_page: perPage,
          },
        }
      );

      if (response.data.length === 0) break;

      allRepos = [...allRepos, ...response.data];
      page++;

      // 如果获取的仓库数少于每页请求数，说明已经是最后一页
      if (response.data.length < perPage) break;
    }

    return allRepos;
  } catch (error) {
    throw handleError(error);
  }
};
const getRepoDetails = async (
  owner: string | undefined,
  name: string | undefined
) => {
  try {
    const response = await request.get(`/repos/${owner}/${name}`);
    const repoDetails: GitHubRepoDetail = response.data;
    return repoDetails;
  } catch (error) {
    throw handleError(error);
  }
};
const getRepoContents = async (
  owner: string,
  repo: string,
  path: string = ""
) => {
  try {
    const response: AxiosResponse<RepoContentItem[]> = await request.get(
      `/repos/${owner}/${repo}/contents/${path}`
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

const getFileContent = async (owner: string, repo: string, path: string) => {
  try {
    const response: AxiosResponse<RepoFileContent> = await request.get(
      `/repos/${owner}/${repo}/contents/${path}`
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

const getRepoContentsByRef = async (
  owner: string,
  repo: string,
  ref: string,
  path: string = ""
) => {
  try {
    const response: AxiosResponse<RepoContentItem[]> = await request.get(
      `/repos/${owner}/${repo}/contents/${path}?ref=${ref}`
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};
const getRepoBranch = async (owner: string, repo: string) => {
  try {
    const response: AxiosResponse<GitHubBranch[]> = await request.get(
      `/repos/${owner}/${repo}/branches}`
    );
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};
//  错误处理函数
const handleError = (error: unknown): Error => {
  if (axios.isAxiosError(error)) {
    return new Error(
      error.response?.data?.message ||
        error.message ||
        "GitHub API request failed"
    );
  }
  return error instanceof Error ? error : new Error("Unknown error occurred");
};
export {
  getUserRepos,
  getRepoDetails,
  getRepoContents,
  getFileContent,
  getRepoContentsByRef,
  getRepoBranch,
};
