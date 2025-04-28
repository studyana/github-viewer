"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { getUserRepos } from "@/services/githubService";
import RepoList from "@/pages/RepoList";
import { GitHubRepo } from "@/types/github";
const Home = () => {
  const [data, setData] = useState<GitHubRepo[]>([]);
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const repos = await getUserRepos("studyana");
        console.log("repos:", repos);
        setData(repos);
      } catch (error) {
        console.error("Error fetching repos:", error);
      }
    };
    fetchRepos();
  }, []);
  return (
    <div className={styles.page}>
      hhh
      <RepoList repos={data}></RepoList>
    </div>
  );
};
export default Home;
