// 'use client';

import Image from 'next/image';
import Link from 'next/link';
import css from './ProfilePage.module.css';
import { getMe } from '@/lib/api/serverApi';

import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Profile',
  description: 'Profile',
};

const ProfilePage = async () => {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link
            href='/profile/edit'
            className={css.editProfileButton}
          >
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar}
            alt={user?.username || 'User avatar'}
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
