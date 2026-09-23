import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-mesh flex items-center justify-center text-neutral-500">Yuklanmoqda...</div>;
  }
  if (!profile) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />
      {children}
    </div>
  );
}
