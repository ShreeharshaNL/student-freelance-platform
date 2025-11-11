import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { StudentRoute, ClientRoute, AuthenticatedRoute } from "./components/ProtectedRoute.jsx";
import Chatbot from "./components/Chatbot.jsx";
import axios from "axios";
import { API_BASE_URL } from "./config.js";
import TermsAndConditions from "./pages/TernsAndConditions.jsx";
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
import ClientActive from "./pages/ClientActive.jsx";
import ClientProfileView from "./pages/ClientProfileView.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import "./index.css";

// Configure axios defaults for the entire app
axios.defaults.baseURL = API_BASE_URL;
console.log('🚀 Application starting with API URL:', API_BASE_URL);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions/>}/>
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
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
          <Route path="/client/active" element={
            <ClientRoute>
              <ClientActive />
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
          <Route path="/client/projects/:projectId/applications" element={
            <ClientRoute>
              <ClientApplications />
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
          <Route path="/client/:clientId" element={
            <AuthenticatedRoute>
              <ClientProfileView />
            </AuthenticatedRoute>
          } />
        </Routes>
        <Chatbot/>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
