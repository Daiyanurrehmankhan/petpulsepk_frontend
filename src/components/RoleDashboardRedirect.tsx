import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function RoleDashboardRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user.role === 'vet') {
    return <Navigate to="/vet-dashboard" replace />;
  } else {
    return <Navigate to="/pet-portal" replace />;
  }
}
