// GitHub 仓库基础信息
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
  } | null;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
  private: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  branches_url: string;
}
// GitHub 仓库详细信息
export interface GitHubRepoDetail {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string | null;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url: string | null;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
  } | null;
  allow_forking: boolean;
  is_template: boolean;
  topics: string[];
  visibility: "public" | "private";
  forks: number;
  open_issues: number;
  watchers: number;
  network_count?: number;
  subscribers_count?: number;
  default_branch: string;
  branches_url: string;
}

// 仓库内容项（文件/目录）
export interface RepoContentItem {
  type: "file" | "dir";
  name: string;
  path: string;
  sha: string;
  size?: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  _links: {
    self: string;
    git: string;
    html: string;
  };
  lastCommit?: {
    date: string;
    message: string;
    author: string;
    url: string;
  };
}

// 文件内容
export interface RepoFileContent {
  type: "file";
  encoding: "base64";
  size: number;
  name: string;
  path: string;
  content: string;
  sha: string;
  url: string;
  html_url: string;
  download_url: string | null;
}
//分支内容
export interface GitHubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

// 仓库提交信息
export interface RepoCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
}
// API 错误响应
export interface GitHubAPIError {
  message: string;
  documentation_url?: string;
  errors?: Array<{
    resource: string;
    field: string;
    code: string;
  }>;
}
