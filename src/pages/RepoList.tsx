import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { GitHubRepo } from "@/types/github";
import { useState } from "react";
import { getUserRepos } from "@/services/githubService";
import { useNavigate } from "react-router-dom";
import formatDate from "@/utils/formatDate";
const columns: TableColumnsType<GitHubRepo> = [
  {
    title: "Repository Name",
    dataIndex: "name",
  },
  {
    title: "Star Count",
    dataIndex: "stargazers_count",
    sorter: {
      compare: (a, b) => a.stargazers_count - b.stargazers_count,
      multiple: 3,
    },
  },
  {
    title: "Update Time",
    dataIndex: "updated_at",
    sorter: {
      compare: (a, b) =>
        new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime(),
      multiple: 2,
    },
  },
  {
    title: "language",
    dataIndex: "language",
    sorter: {
      compare: (a, b) => (a.language || "").localeCompare(b.language || ""),
      multiple: 1,
    },
  },
  {
    title: "description",
    dataIndex: "description",
  },
];

const RepoList: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GitHubRepo[]>([]);
  const [username, setUsername] = useState<string>("");
  const handleSearch = async (username: string) => {
    setLoading(true);
    try {
      const repos = await getUserRepos(username);
      repos.map((repo) => {
        repo.updated_at = formatDate(repo.updated_at);
        return repo;
      });
      setData(repos);
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      else setError("Unknown error");
      console.error("Error fetching repos:", error);
    }
    setLoading(false);
  };
  return (
    <>
      <div>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
        />
        <button
          onClick={() => handleSearch(username)}
          disabled={!username || loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>
      {error && <div>Error: {error}</div>}
      {!error && (
        <Table<GitHubRepo>
          rowKey="id"
          columns={columns}
          dataSource={data}
          onRow={(record) => ({
            onClick: () => navigate(`/${record.owner.login}/${record.name}`),
          })}
        />
      )}
    </>
  );
};

export default RepoList;
