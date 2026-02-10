'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import RetailerDashboard from '@/components/RetailerDashboard';
import AdminDashboard from '@/components/AdminDashboard';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'ADMIN') {
        router.push('/admin');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role === 'ADMIN') {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <main>
      <RetailerDashboard user={user} />

      <style jsx>{`
        .loading-screen {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--primary);
        }
      `}</style>
    </main>
  );
}
