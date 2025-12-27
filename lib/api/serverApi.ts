import type { Note, NotesResponse } from '@/types/note';
import api from '@/lib/api/api';
import { cookies } from 'next/headers';
import { User } from '@/types/user';

export const fetchNoteById = async (id: string) => {
  const cookieStore = await cookies();
  const noteById = await api.get<Note>(`/notes/${id}`, {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  return noteById.data;
};

export async function fetchNotes(
  title: string,
  page: number,
  category?: string
): Promise<NotesResponse> {
  const cookieStore = await cookies();
  const response = await api.get<NotesResponse>('/notes', {
    params: {
      search: title,
      page,
      perPage: 12,
      tag: category,
    },
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
}

export const checkServerSession = async () => {
  // Дістаємо поточні cookie
  const cookieStore = await cookies();
  const res = await api.get('/auth/session', {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get<User>('/users/me', {
    headers: {
      // передаємо кукі далі
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
