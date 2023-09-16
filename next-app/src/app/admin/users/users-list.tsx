'use client';

import { apiFunctions } from '@/api';
import { Role } from '@/enums/role.enum';
import { User } from '@/interfaces/user.interface';
import { useAuthState } from '@/state/auth-state';
import { faCrown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { DeleteUserDialog } from './delete-user-dialog';

export function UsersList() {
  const [getAccessToken, getMe] = useAuthState((s) => [
    s.getAccessToken,
    s.getUser,
  ]);

  const [users, setUsers] = useState<User[]>();
  const [me, setMe] = useState<User>();
  const [deleteUser, setDeleteUser] = useState<User>();

  useEffect(() => {
    getAccessToken().then(async (token) => {
      if (!token) return;
      const users = await apiFunctions.getAllUsers(token);

      const me = await getMe();
      if (!me) return;

      setUsers(users.data);
      setMe(me);
    });
  }, [getAccessToken, getMe]);

  if (!users || !me) return <div>Loading...</div>;

  return (
    <>
      <div>
        {users.map((user: User) => (
          <div
            key={user._id}
            className="flex border-b border-b-gray-500 px-4 py-2 last:border-b-0"
          >
            <div className="my-auto flex-1">
              <div className="text-xl">
                <span className="font-callsign">
                  {user.username.toUpperCase()}
                </span>{' '}
                - {user.name}
              </div>{' '}
              <div className="text-xs opacity-80">{user._id}</div>
            </div>
            <div className="my-auto flex-1">
              <div className="text-sm opacity-80">Email: {user.email}</div>
              <div className="text-sm opacity-80">Phone: {user.phone}</div>
            </div>
            <button
              className={`h-14 w-14 rounded-full hover:bg-yellow-500/30 disabled:hover:bg-transparent ${
                user.roles.includes(Role.Admin)
                  ? 'text-yellow-400'
                  : 'text-gray-400'
              }`}
              disabled={user._id === me?._id}
            >
              <FontAwesomeIcon
                icon={faCrown}
                className="h-5 w-5 leading-none"
              />
            </button>
            <button
              className={`h-14 w-14 rounded-full text-red-500 hover:bg-red-500/30 ${
                user._id === me?._id ? 'invisible' : ''
              }`}
              onClick={() => setDeleteUser(user)}
            >
              <FontAwesomeIcon
                icon={faTrash}
                className="h-5 w-5 leading-none"
              />
            </button>
          </div>
        ))}
      </div>

      <DeleteUserDialog
        user={deleteUser}
        onCancel={() => setDeleteUser(undefined)}
        onConfirm={async () => {
          const token = await getAccessToken();
          if (!token) return;
          apiFunctions.deleteUser(token, deleteUser!._id);
          setDeleteUser(undefined);
          window.location.reload();
        }}
      />
    </>
  );
}
