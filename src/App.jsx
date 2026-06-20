import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import BugList from './pages/BugList';
import BugDetail from './pages/BugDetail';
import CreateBug from './pages/CreateBug';
import UserManagement from './pages/UserManagement';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Keeps logged-in users out of the public landing/login pages —
// they get sent straight to the app instead.
const PublicOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <PublicOnlyRoute><Landing /></PublicOnlyRoute>
      } />
      <Route path="/login" element={
        <PublicOnlyRoute><Login /></PublicOnlyRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute>
          <Layout><ProjectList /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/bugs/project/:projectId" element={
        <ProtectedRoute>
          <Layout><BugList /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/bugs/create" element={
        <ProtectedRoute>
          <Layout><CreateBug /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/bugs/:id" element={
        <ProtectedRoute>
          <Layout><BugDetail /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute adminOnly>
          <Layout><UserManagement /></Layout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;