import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import NotFound from "./components/404/NotFound";
import DashBoard from "./components/DashBoard/DashBoard";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";

const App = () => {
  const isLoggetIn = useSelector((state) => state.login.isLoggedIn);

  const loggedInRoutes = (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/*" element={<NotFound/>} />
    </Routes>
  );

  const loggedOutRoutes = (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/*" element={<NotFound/>} />
    </Routes>
  );

  return isLoggetIn ? loggedInRoutes : loggedOutRoutes;
};

export default App;
