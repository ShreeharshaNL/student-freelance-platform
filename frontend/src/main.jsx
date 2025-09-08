import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import ClientProfile from "./pages/ClientProfile.jsx";
import StudentApplications from "./pages/StudentApplications.jsx";
import PostProject from "./pages/PostProject.jsx";
import StudentMessages from "./pages/StudentMessages.jsx";
import ClientMessages from "./pages/ClientMessages.jsx";
import StudentEarnings from "./pages/StudentEarnings.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import StudentActiveProjects from "./pages/StudentActiveProjects.jsx";
import ClientApplications from "./pages/ClientApplications.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<StudentProfile />} />
        <Route path="/student/applications" element={<StudentApplications />} />
        <Route path="/student/active-projects" element={<StudentActiveProjects />} />
        <Route path="/student/messages" element={<StudentMessages />} />
        <Route path="/student/earnings" element={<StudentEarnings />} />
        
        {/* Client Routes */}
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/client/profile" element={<ClientProfile />} />
        <Route path="/client/post-project" element={<PostProject />} />
        <Route path="/client/applications" element={<ClientApplications />} />
        <Route path="/client/messages" element={<ClientMessages />} />
        
        {/* General Routes */}
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
