import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Practice from './pages/Practice';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './services/auth';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            isAuthenticated() ? <Navigate to="/practice" replace /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated() ? <Navigate to="/practice" replace /> : <Register />
          }
        />

        {/* Protected routes */}
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <Practice />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/practice" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
