// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import SignInForm from "./components/SignInForm";
import Register from "./components/Register";
import TaskPage from "./components/TaskPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<SignInForm />} />
          <Route path="/register" element={<Register />} />

          {/* Protected tasks route */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TaskPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all unknown routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
