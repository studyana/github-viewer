import React, { useState } from "react";
import { getFileContent, getRepoContents } from "@/services/githubService";
import { GitHubRepo, RepoContentItem, RepoFileContent } from "@/types/github";
import styles from "./RepoContents.module.css";
const RepoContents = ({ repository }: { repository: GitHubRepo }) => {
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo>(repository);
  const [contents, setContents] = useState<RepoContentItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>("");
  const [fileContent, setFileContent] = useState<RepoFileContent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // 处理路径导航
  const navigateToPath = (path: string) => {
    if (!selectedRepo) return;
    fetchRepoContents(selectedRepo, path);
  };
  // 获取文件内容
  const fetchFileContent = async (item: RepoContentItem) => {
    if (item.type !== "file") return;
    setLoading(true);
    setError(null);
    try {
      console.log(
        "开始获取文件内容:",
        selectedRepo!.owner.login,
        selectedRepo!.name,
        item.path
      );
      const content = await getFileContent(
        selectedRepo!.owner.login,
        selectedRepo!.name,
        item.path
      );
      setFileContent(content);
    } catch (err) {
      let errorMessage = "未知错误";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 解码 Base64 内容
  const decodeContent = (encoded: string): string => {
    try {
      return atob(encoded.replace(/\s/g, ""));
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      }
      return "Unable to decode file content";
    }
  };

  // 获取仓库内容
  const fetchRepoContents = async (repo: GitHubRepo, path: string = "") => {
    setLoading(true);
    setError(null);

    try {
      console.log("开始获取:", repo.owner.login, repo.name, path);
      const contents = await getRepoContents(repo.owner.login, repo.name, path);
      setSelectedRepo(repo);
      setContents(contents);
      setCurrentPath(path);
      setFileContent(null);
    } catch (err) {
      let errorMessage = "未知错误";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  if (error) return <div className={styles.errorMessage}>{error}</div>;
  if (loading) return <div className={styles.loading}>Loading...</div>;
  return (
    <div className={styles.contentArea}>
      {selectedRepo && (
        <>
          <div className={styles.breadcrumbs}>
            <button onClick={() => navigateToPath("")}>
              {selectedRepo.name}
            </button>
            {currentPath.split("/").map(
              (part, index, parts) =>
                part && (
                  <React.Fragment key={index}>
                    <span> / </span>
                    <button
                      onClick={() =>
                        navigateToPath(parts.slice(0, index + 1).join("/"))
                      }
                    >
                      {part}
                    </button>
                  </React.Fragment>
                )
            )}
          </div>

          {fileContent ? (
            <div className={styles.fileContent}>
              <h3>{fileContent.name}</h3>
              <pre>{decodeContent(fileContent.content)}</pre>
            </div>
          ) : (
            <div className={styles.contentList}>
              {contents.map((item) => (
                <div
                  key={item.sha}
                  className={`${styles.contentItem} ${styles[item.type]}`}
                  onClick={() =>
                    item.type === "dir"
                      ? navigateToPath(item.path)
                      : fetchFileContent(item)
                  }
                >
                  <div className={styles.itemName}>
                    {item.type === "dir" ? "📁" : "📄"} {item.name}
                  </div>
                  {item.type === "file" && item.size && (
                    <div className={styles.itemSize}>
                      {(item.size / 1024).toFixed(2)} KB
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default RepoContents;
