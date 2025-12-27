'use client';

import { checkSession, getMe, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';

const PRIVATE_ROUTES = ['/profile', '/profile/edit', '/notes/:path*'];

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    state => state.clearIsAuthenticated
  );

  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const isPrivateRoute = PRIVATE_ROUTES.some(route =>
          pathname.startsWith(route)
        );
        const isAuthenticated = await checkSession();

        if (!isAuthenticated && isPrivateRoute) {
          await logout();
          clearIsAuthenticated();
          router.replace('/login');
          return;
        }

        if (isAuthenticated) {
          const user = await getMe();
          if (user) setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch (error) {
        console.error('Auth error:', error);
        clearIsAuthenticated();
      } finally {
        setLoading(false); // Завжди виконується
      }
    };

    fetchUser();
  }, [setUser, clearIsAuthenticated, router, pathname]);

  if (loading) {
    return <Loader />;
  }

  return children;
};

export default AuthProvider;
