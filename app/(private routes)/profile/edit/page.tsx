'use client';

import Image from 'next/image';
import css from './EditProfilePage.module.css';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { getMe, update } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';

const EditProfile = () => {
  const { user, setUser } = useAuthStore();
  const [username, setUserName] = useState(user?.username || '');
  const router = useRouter();

  // const [photo, setPhoto] = useState('');

  useEffect(() => {
    getMe().then(user => {
      setUserName(user.username ?? '');
    });
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const handleSaveUser = async (formData: FormData) => {
    try {
      const username = formData.get('username') as string;

      const updatedUser = await update({ username });
      setUser(updatedUser);
      router.push('/profile');
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        {user && (
          <Image
            src={user.avatar}
            alt='User Avatar'
            width={120}
            height={120}
            className={css.avatar}
          />
        )}

        <form
          className={css.profileInfo}
          action={handleSaveUser}
        >
          <div className={css.usernameWrapper}>
            <label htmlFor='username'>Username:</label>
            <input
              id='username'
              type='text'
              className={css.input}
              value={username}
              onChange={handleChange}
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button
              type='submit'
              className={css.saveButton}
            >
              Save
            </button>
            <button
              type='button'
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProfile;
