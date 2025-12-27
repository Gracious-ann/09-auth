'use client';

import { useMutation } from '@tanstack/react-query';
import css from './SignUpPage.module.css';
import { register } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ApiError } from '@/app/api/api';
import { useAuthStore } from '@/lib/store/authStore';

function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();

  const { mutate } = useMutation({
    mutationFn: register,
    onSuccess: user => {
      setUser(user);
      console.log('Успішна реєстрація:', user);
      router.push('/profile');
    },

    onError: error => {
      const err = error as ApiError;

      setError(
        err.response?.data?.validation?.body?.message ??
          err.response?.data?.message ??
          err.message
      );
    },
    // onError: error => {
    //   setError(
    //     (error as ApiError).response?.data?.error ?? (error as ApiError).message
    //   );
    // },
  });

  const handleSubmit = (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    mutate({ email, password });
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form
        className={css.form}
        action={handleSubmit}
      >
        <div className={css.formGroup}>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            name='email'
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            type='password'
            name='password'
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type='submit'
            className={css.submitButton}
          >
            Register
          </button>
        </div>
        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}

export default SignUpPage;
