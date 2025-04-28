"use client";
import styles from "./page.module.css";
import { useEffect } from "react";
import { getUserRepos } from "@/services/githubService";
const Home = () => {
  useEffect(() => {
    const data = getUserRepos("studyan");
    console.log("key:", `${process.env.REACT_APP_GITHUB_TOKEN}`);
    console.log("data:", data);
  }, []);
  return <div className={styles.page}> hhh</div>;
};
export default Home;
