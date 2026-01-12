import { Outlet, Link, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { logoutUser } from '../../services/auth';
import './AdminLayout.css';

function AdminLayout() {
  const { user } = useUser();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-header">
          <h2>Admin Portal</h2>
          <p className="admin-user-info">
            {user?.username} <span className="badge">Admin</span>
          </p>
        </div>

        <nav className="admin-nav">
          <Link
            to="/admin/problems"
            className={isActive('/admin/problems') ? 'active' : ''}
          >
            Problems
          </Link>
          <Link
            to="/admin/bulk-generate"
            className={isActive('/admin/bulk-generate') ? 'active' : ''}
          >
            Bulk Generate
          </Link>
          <Link
            to="/admin/tags"
            className={isActive('/admin/tags') ? 'active' : ''}
          >
            Tag Management
          </Link>
          <Link
            to="/admin/prompts"
            className={isActive('/admin/prompts') ? 'active' : ''}
          >
            Prompt Management
          </Link>
          <Link
            to="/admin/analytics"
            className={isActive('/admin/analytics') ? 'active' : ''}
          >
            Analytics
          </Link>
        </nav>

        <div className="admin-footer">
          <Link to="/practice" className="btn-secondary">
            Back to Practice
          </Link>
          <button onClick={logoutUser} className="btn-danger">
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
