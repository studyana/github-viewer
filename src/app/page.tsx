"use client";
import React from "react";
import RepoList from "@/pages/RepoList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RepoDetail from "@/pages/RepoDetail";
import Login from "@/pages/Login";
const Home = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RepoList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/:owner/:repo" element={<RepoDetail />} />
      </Routes>
    </Router>
  );
};
export default Home;
