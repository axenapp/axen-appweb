import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  requirePartner?: boolean;
}

export default function PrivateRoute({ children, requirePartner = false }: Props) {
  const { isAuthenticated, isPartner } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requirePartner && !isPartner) return <Navigate to="/" replace />;

  return children;
}
