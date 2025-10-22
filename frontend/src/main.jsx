import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { StudentRoute, ClientRoute, AuthenticatedRoute } from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
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
import ClientProjects from "./pages/ClientProjects.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Student Protected Routes */}
          <Route path="/student/dashboard" element={
            <StudentRoute>
              <StudentDashboard />
            </StudentRoute>
          } />
          <Route path="/student/profile" element={
            <StudentRoute>
              <StudentProfile />
            </StudentRoute>
          } />
          <Route path="/student/applications" element={
            <StudentRoute>
              <StudentApplications />
            </StudentRoute>
          } />
          <Route path="/student/active-projects" element={
            <StudentRoute>
              <StudentActiveProjects />
            </StudentRoute>
          } />
          <Route path="/student/messages" element={
            <StudentRoute>
              <StudentMessages />
            </StudentRoute>
          } />
          <Route path="/student/earnings" element={
            <StudentRoute>
              <StudentEarnings />
            </StudentRoute>
          } />
          
          {/* Client Protected Routes */}
          <Route path="/client/dashboard" element={
            <ClientRoute>
              <ClientDashboard />
            </ClientRoute>
          } />
          <Route path="/client/profile" element={
            <ClientRoute>
              <ClientProfile />
            </ClientRoute>
          } />
          <Route path="/client/post-project" element={
            <ClientRoute>
              <PostProject />
            </ClientRoute>
          } />
          <Route path="/client/applications" element={
            <ClientRoute>
              <ClientApplications />
            </ClientRoute>
          } />
          <Route path="/client/messages" element={
            <ClientRoute>
              <ClientMessages />
            </ClientRoute>
          } />
          <Route path="/client/projects" element={
            <ClientRoute>
              <ClientProjects />
            </ClientRoute>
          } />
          
          {/* General Authenticated Routes */}
          <Route path="/projects" element={
            <AuthenticatedRoute>
              <ProjectsPage />
            </AuthenticatedRoute>
          } />
          <Route path="/projects/:id" element={
            <AuthenticatedRoute>
              <ProjectDetail />
            </AuthenticatedRoute>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
