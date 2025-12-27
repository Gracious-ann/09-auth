import type { CreateNote, Note, NotesResponse } from '@/types/note';
import api from '@/lib/api/api';
import { User } from '@/types/user';

export interface UserRegister {
  email: string;
  password: string;
}

export interface CheckSessionResponse {
  success: boolean;
}

export type UpdateUserRequest = {
  username?: string;
  photo?: string;
};

export async function fetchNotes(
  title: string,
  page: number,
  category?: string
): Promise<NotesResponse> {
  const response = await api.get<NotesResponse>('/notes', {
    params: {
      search: title,
      page,
      perPage: 12,
      tag: category,
    },
    // headers: {
    //   Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    // },
  });
  return response.data;
}

export async function createNote({
  title,
  content,
  tag,
}: CreateNote): Promise<Note> {
  const addNote = await api.post<Note>(
    '/notes',

    {
      title,
      content,
      tag,
    },
    {
      // headers: {
      //   Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
      // },
    }
  );
  return addNote.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const deleteNote = await api.delete<Note>(`/notes/${id}`, {
    // headers: {
    //   Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    // },
  });
  return deleteNote.data;
}

export const fetchNoteById = async (id: string) => {
  const noteById = await api.get<Note>(`/notes/${id}`, {
    // headers: {
    //   Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    // },
  });
  return noteById.data;
};

export const register = async (
  RegisterUserData: UserRegister
): Promise<User> => {
  const { data: registerData } = await api.post<User>(
    '/auth/register',
    RegisterUserData
  );

  return registerData;
};

export const login = async (RegisterUserData: UserRegister): Promise<User> => {
  const { data: loginData } = await api.post<User>(
    '/auth/login',
    RegisterUserData
  );

  return loginData;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<boolean> => {
  const { data } = await api.get<CheckSessionResponse>('/auth/session');

  return data.success;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');

  return data;
};
export const update = async (payload: UpdateUserRequest): Promise<User> => {
  const { data } = await api.patch<User>('/users/me', payload);

  return data;
};
