import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('owner' | 'vet')[];
}

export function PrivateRoute({ children, allowedRoles }: PrivateRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role)) {
      toast({
        title: "Access Denied",
        description: `This page is only accessible to ${allowedRoles.join(' and ')}s.`,
        variant: "destructive",
      });
    }
  }, [isAuthenticated, allowedRoles, user]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    const redirectTo = user.role === 'vet' ? '/vet-dashboard' : '/pet-portal';
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect to the page they came from, or home if no previous location
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}