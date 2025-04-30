"use client";
import React from "react";
import RepoList from "@/pages/RepoList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RepoDetail from "@/pages/RepoDetail";
import Login from "@/pages/Login";
import PrivateRoute from "@/pages/privateroute";
const Home = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <RepoList />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/:owner/:repo"
          element={
            <PrivateRoute>
              <RepoDetail />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};
export default Home;
