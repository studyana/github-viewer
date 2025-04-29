"use client";
import React from "react";
import RepoList from "@/pages/RepoList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const Home = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RepoList />} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/:username/:repos" element={<div>repo</div>} />
      </Routes>
    </Router>
  );
};
export default Home;
