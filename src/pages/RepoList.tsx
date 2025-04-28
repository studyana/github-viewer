import React from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { GitHubRepo } from "@/types/github";
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

interface RepoListProps {
  repos: GitHubRepo[];
}

const RepoList: React.FC<RepoListProps> = ({ repos }) => {
  return (
    <>
      <Table<GitHubRepo> columns={columns} dataSource={repos} />
    </>
  );
};

export default RepoList;
