import { Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

function AdminRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/practice" replace />;
  }

  return children;
}

export default AdminRoute;
