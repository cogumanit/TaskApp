// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./components/Login";
import Register from "./components/Register";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import ErrorMessage from "./components/ErrorMessage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected tasks route */}
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                  <header className="max-w-4xl mx-auto px-6 py-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
                          Tasks
                        </h1>
                        <p className="text-gray-600">Create a task and it will appear below.</p>
                      </div>
                    </div>
                  </header>

                  <main className="max-w-4xl mx-auto px-6 pb-8 space-y-8">
                    <TaskForm />
                    <ErrorMessage />
                    <TaskList />
                  </main>
                </div>
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
