'use client';
import { ApiError } from '@/app/api/api';
import css from './SignInPage.module.css';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuthStore();
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: login,
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
  });

  const handleSubmit = (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    mutate({ email, password });
  };
  return (
    <main className={css.mainContent}>
      <form
        className={css.form}
        action={handleSubmit}
      >
        <h1 className={css.formTitle}>Sign in</h1>

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
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}

export default SignInPage;
