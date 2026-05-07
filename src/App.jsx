import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import BugList from './pages/BugList';
import BugDetail from './pages/BugDetail';
import CreateBug from './pages/CreateBug';
import UserManagement from './pages/UserManagement';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
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
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;