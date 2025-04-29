import { GitHubRepo } from "@/types/github";
const setRepos = (repos: GitHubRepo[]) => {
  return localStorage.setItem("repos", JSON.stringify(repos));
};

const getRepos = () => {
  const repos = localStorage.getItem("repos");
  return repos ? JSON.parse(repos) : [{ owner: { login: "" } }];
};
const clearRepos = () => {
  return localStorage.removeItem("repos");
};
export { setRepos, getRepos, clearRepos };
