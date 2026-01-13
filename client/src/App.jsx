import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Practice from './pages/Practice';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { UserProvider } from './contexts/UserContext';
import { isAuthenticated } from './services/auth';

// Admin pages
import AdminLayout from './pages/admin/AdminLayout';
import ProblemsManagement from './pages/admin/ProblemsManagement';
import CreateProblem from './pages/admin/CreateProblem';
import EditProblem from './pages/admin/EditProblem';
import BulkGenerate from './pages/admin/BulkGenerate';
import TagManagement from './pages/admin/TagManagement';
import PromptManagement from './pages/admin/PromptManagement';
import Analytics from './pages/admin/Analytics';

function App() {
  return (
    <UserProvider>
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

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/problems" replace />} />
            <Route path="problems" element={<ProblemsManagement />} />
            <Route path="problems/new" element={<CreateProblem />} />
            <Route path="problems/:id/edit" element={<EditProblem />} />
            <Route path="bulk-generate" element={<BulkGenerate />} />
            <Route path="tags" element={<TagManagement />} />
            <Route path="prompts" element={<PromptManagement />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

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
    </UserProvider>
  );
}

export default App;
