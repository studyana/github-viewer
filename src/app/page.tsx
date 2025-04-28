"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { getUserRepos } from "@/services/githubService";
import RepoList from "@/pages/RepoList";
import { GitHubRepo } from "@/types/github";
const Home = () => {
  const [data, setData] = useState<GitHubRepo[]>([]);
  const [username, setUsername] = useState<string>("");
  const handleSearch = async (username: string) => {
    try {
      const repos = await getUserRepos(username);
      setData(repos);
    } catch (error) {
      console.error("Error fetching repos:", error);
    }
  };
  return (
    <div className={styles.page}>
      <div className={styles.search_section}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
        />
        <button onClick={() => handleSearch(username)}>搜索</button>
      </div>
      <RepoList repos={data}></RepoList>
    </div>
  );
};
export default Home;
