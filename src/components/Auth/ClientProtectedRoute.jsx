import React from 'react';
import { Navigate } from 'react-router-dom';
import { useClientAuth } from '@/context/ClientAuthContext';

function ClientProtectedRoute({ children }) {
  const { user, profile, loading } = useClientAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#B5FF00] border-t-transparent"></div>
          <p className="mt-4 text-neutral-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile || profile.role !== 'customer') {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ClientProtectedRoute;
