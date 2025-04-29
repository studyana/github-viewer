import { GitHubRepoDetail } from "@/types/github";
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRepoDetails } from "@/services/githubService";
import styles from "./RepoDetail.module.css";
const RepoDetail = () => {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const [repoDetail, setRepoDetail] = useState<GitHubRepoDetail | null>(null);
  useEffect(() => {
    const fetchrepoDetail = async () => {
      try {
        const data = await getRepoDetails(owner, repo);
        setRepoDetail(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchrepoDetail();
  }, [owner, repo]);
  if (!repoDetail) {
    return <div className={styles.loading}>Loading...</div>;
  }
  return (
    <>
      <div className={styles.repoDetail}>
        <header className={styles.repoHeader}>
          <div className={styles.ownerInfo}>
            <img
              src={repoDetail.owner.avatar_url}
              alt={`${repoDetail.owner.login}'s avatar`}
              className={styles.avatar}
            />
            <a
              href={repoDetail.owner.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {repoDetail.owner.login}
            </a>
            <span>/</span>
            <a
              href={repoDetail.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.repoName}
            >
              {repoDetail.name}
            </a>
            <span className={styles.visibilityBadge}>
              {repoDetail.private ? "Private" : "Public"}
            </span>
          </div>

          <div className={styles.repoActions}>
            <a
              href={`${repoDetail.html_url}/fork`}
              className={styles.btn}
              target="_blank"
              rel="noopener noreferrer"
            >
              Fork
            </a>
            <a
              href={`${repoDetail.html_url}/stargazers`}
              className={styles.btn}
              target="_blank"
              rel="noopener noreferrer"
            >
              ⭐ Star ({repoDetail.stargazers_count})
            </a>
          </div>
        </header>

        <div className={styles.repoDescription}>
          {repoDetail.description || "No description provided"}
        </div>

        <div className={styles.repoMeta}>
          {repoDetail.language && (
            <span className={styles.metaItem}>
              <span
                className={styles.languageColor}
                style={{
                  backgroundColor: getLanguageColor(repoDetail.language),
                }}
              />
              {repoDetail.language}
            </span>
          )}

          <a
            href={`${repoDetail.html_url}/forks`}
            className={styles.metaItem}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span role="img" aria-label="forks">
              🍴
            </span>{" "}
            {repoDetail.forks_count}
          </a>

          <a
            href={`${repoDetail.html_url}/issues`}
            className={styles.metaItem}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span role="img" aria-label="issues">
              ❗
            </span>{" "}
            {repoDetail.open_issues_count}
          </a>

          {repoDetail.license && (
            <span className={styles.metaItem}>
              <span role="img" aria-label="license">
                📜
              </span>{" "}
              {repoDetail.license.name}
            </span>
          )}

          <span className={styles.metaItem}>
            Updated on {formatDate(repoDetail.pushed_at)}
          </span>
        </div>

        {repoDetail.homepage && (
          <div className={styles.repoHomepage}>
            <a
              href={
                repoDetail.homepage.startsWith("http")
                  ? repoDetail.homepage
                  : `https://${repoDetail.homepage}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <span role="img" aria-label="homepage">
                🏠
              </span>{" "}
              {repoDetail.homepage}
            </a>
          </div>
        )}

        {repoDetail.topics && repoDetail.topics.length > 0 && (
          <div className={styles.repoTopics}>
            {repoDetail.topics.map((topic) => (
              <a
                key={topic}
                href={`https://github.com/topics/${topic}`}
                className={styles.topicTag}
                target="_blank"
                rel="noopener noreferrer"
              >
                {topic}
              </a>
            ))}
          </div>
        )}

        <div className={styles.repoClone}>
          <h3>Clone</h3>
          <div className={styles.cloneOptions}>
            <div className={styles.cloneOption}>
              <label>HTTPS</label>
              <input
                type="text"
                value={repoDetail.clone_url}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
            <div className={styles.cloneOption}>
              <label>SSH</label>
              <input
                type="text"
                value={repoDetail.ssh_url}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
// 辅助函数 - 获取语言颜色 (简化版)
function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    Go: "#00ADD8",
    Ruby: "#701516",
    PHP: "#4F5D95",
    "C++": "#f34b7d",
    C: "#555555",
    Shell: "#89e051",
    Rust: "#dea584",
    Swift: "#ffac45",
    Kotlin: "#F18E33",
    HTML: "#e34c26",
    CSS: "#563d7c",
  };
  return colors[language] || "#cccccc";
}
export default RepoDetail;
