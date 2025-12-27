'use client';

import { checkSession, getMe, logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

      const isPrivateRoute = PRIVATE_ROUTES.some(route =>
        pathname.startsWith(route)
      );
      const isAuthenticated = await checkSession();

      if (!isAuthenticated && isPrivateRoute) {
        await logout();
        clearIsAuthenticated();
        router.replace('/login');
        setLoading(false);
        return;
      }

      if (isAuthenticated) {
        const user = await getMe();
        if (user) setUser(user);
      } else {
        clearIsAuthenticated();
        setLoading(false);
      }
    };
    fetchUser();
  }, [setUser, clearIsAuthenticated, router, pathname]);

  //   if (loading) {
  //     return <div>Loading...</div>;
  //   }

  return children;
};

export default AuthProvider;
