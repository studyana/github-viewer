import React, { useState, useEffect } from "react";
import {
  GitHubRepo,
  GitHubBranch,
  RepoContentItem,
  RepoFileContent,
} from "@/types/github";
import {
  getFileContent,
  getRepoContentsByRef,
  getRepoDetails,
  getRepoBranch,
  getRepoCommit,
} from "@/services/githubService";
import styles from "./RepoBranch.module.css";
interface GitHubRepoViewerProps {
  owner: string;
  repo: string;
}

const RepoBranch: React.FC<GitHubRepoViewerProps> = ({ owner, repo }) => {
  const [repository, setRepository] = useState<GitHubRepo | null>(null);
  const [branches, setBranches] = useState<GitHubBranch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [currentPath, setCurrentPath] = useState<string>("");
  const [files, setFiles] = useState<RepoContentItem[]>([]);
  const [fileContent, setFileContent] = useState<RepoFileContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化获取仓库信息和分支
  useEffect(() => {
    const fetchRepoAndBranches = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 获取仓库信息
        const repoResponse = await getRepoDetails(owner, repo);

        setRepository(repoResponse);
        setSelectedBranch(repoResponse.default_branch);

        // 获取分支列表
        const branchesResponse = await getRepoBranch(owner, repo);
        console.log(
          "分支列表路径" + repoResponse.branches_url.replace("{/branch}", "")
        );
        console.log(branchesResponse);
        setBranches(branchesResponse);

        // 加载根目录内容
        await loadDirectory(repoResponse.default_branch, "");
      } catch (err) {
        if (err instanceof Error)
          setError(`Failed to fetch repository: ${err.message}`);
        else setError("Failed to fetch repository");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepoAndBranches();
  }, [owner, repo]);

  // 加载目录内容
  const loadDirectory = async (branch: string, path: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getRepoContentsByRef(owner, repo, branch, path);
      const data = await Promise.all(
        response.map(async (item) => {
          const commit = await getRepoCommit(owner, repo, item.path, branch);
          return {
            ...item,
            lastCommit: commit
              ? {
                  date: commit.commit.committer.date,
                  message: commit.commit.message,
                  author: commit.commit.author.name,
                  url: commit.html_url,
                }
              : undefined,
          };
        })
      );

      setFiles(data);
      setCurrentPath(path);
      setFileContent(null); // 清除之前可能加载的文件内容
    } catch (err) {
      if (err instanceof Error)
        setError(`Failed to load directory: ${err.message}`);
      else setError("Failed to load directory");
    } finally {
      setIsLoading(false);
    }
  };

  // 加载文件内容
  const loadFile = async (file: RepoContentItem) => {
    if (file.type !== "file") return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getFileContent(owner, repo, file.path);

      setFileContent(response);
    } catch (err) {
      if (err instanceof Error) setError(`Failed to load file: ${err.message}`);
      else setError("Failed to load file");
    } finally {
      setIsLoading(false);
    }
  };

  // 处理分支切换
  const handleBranchChange = (branchName: string) => {
    setSelectedBranch(branchName);
    loadDirectory(branchName, currentPath);
  };

  // 处理目录导航
  const navigateToDirectory = (path: string) => {
    loadDirectory(selectedBranch, path);
  };

  // 解码 base64 文件内容
  const decodeFileContent = (encodedContent: string) => {
    try {
      return atob(encodedContent);
    } catch (err) {
      if (err instanceof Error)
        setError(`Failed to decode file content: ${err.message}`);
      else setError("Failed to decode file content");
      return "";
    }
  };

  return (
    <div className={styles.githubRepoViewer}>
      {isLoading && <div className={styles.loading}>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}

      {repository && (
        <div className={styles.repoHeader}>
          <h2>
            <a
              href={`https://github.com/${owner}/${repo}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {owner}/{repo}
            </a>
          </h2>

          <div className={styles.branchSelector}>
            <label htmlFor="branch-select">Branch: </label>
            <select
              id="branch-select"
              value={selectedBranch}
              onChange={(e) => handleBranchChange(e.target.value)}
              disabled={isLoading}
            >
              {branches.map((branch) => (
                <option key={branch.name} value={branch.name}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className={styles.breadcrumbs}>
        <button onClick={() => navigateToDirectory("")} disabled={!currentPath}>
          Root
        </button>
        {currentPath.split("/").map((part, index, parts) => {
          if (!part) return null;
          const path = parts.slice(0, index + 1).join("/");
          return (
            <React.Fragment key={path}>
              <span> / </span>
              <button onClick={() => navigateToDirectory(path)}>{part}</button>
            </React.Fragment>
          );
        })}
      </div>

      {fileContent ? (
        <div className={styles.fileContent}>
          <h3>{fileContent.name}</h3>
          <pre>{decodeFileContent(fileContent.content)}</pre>
          <button onClick={() => setFileContent(null)}>
            Back to directory
          </button>
        </div>
      ) : (
        <div className={styles.directoryListing}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Commit Message</th>
                <th>Last Commit</th>
                <th>Size</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.path}>
                  <td>
                    {file.type === "dir" ? (
                      <button onClick={() => navigateToDirectory(file.path)}>
                        📁{file.name}/
                      </button>
                    ) : (
                      <button onClick={() => loadFile(file)}>
                        📄{file.name}
                      </button>
                    )}
                  </td>
                  <td className="commitMessage">
                    {file.lastCommit ? (
                      <a
                        href={file.lastCommit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={file.lastCommit.message}
                      >
                        {file.lastCommit.message
                          .split("\n")[0]
                          .substring(0, 50)}
                        {file.lastCommit.message.length > 50 ? "..." : ""}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    {file.lastCommit ? (
                      <a
                        href={file.lastCommit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {new Date(file.lastCommit.date).toLocaleString()} by{" "}
                        {file.lastCommit.author}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td style={{ fontFamily: "monospace" }}>
                    {file.size !== 0 && `${file.size}KB`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RepoBranch;
