import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../ProtectedAdminRoute/ProtectedAdminRoute.css';

/** Rutas que pueden usar administradores y usuarios refugio (SHELTER). */
const ProtectedPublisherRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const canPublish = user?.isAdmin === true || user?.role === 'SHELTER';
  if (!user || !canPublish) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedPublisherRoute;
