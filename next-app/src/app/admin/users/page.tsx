'use client';

import { useAuthState } from '@/state/auth-state';
import NoSSR from 'react-no-ssr';
import { CreateUserForm } from './create-user-form';
import { UsersList } from './users-list';

export default function AdminUsers() {
  return (
    <>
      <h2 className="text-2xl font-medium">Create user</h2>

      <CreateUserForm />

      <h2 className="text-2xl font-medium">Users</h2>

      <NoSSR>
        <UsersList />
      </NoSSR>
    </>
  );
}
