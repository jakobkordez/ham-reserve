'use client';

import { apiFunctions } from '@/api';
import { Loading } from '@/components/loading';
import { Role } from '@/enums/role.enum';
import { User } from '@/interfaces/user.interface';
import { faCrown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createRef, useEffect, useState } from 'react';

export function UsersList() {
  const [users, setUsers] = useState<User[]>();
  const [me, setMe] = useState<User>();

  const [deleteUser, setDeleteUser] = useState<User>();
  const dialogRef = createRef<HTMLDialogElement>();

  async function getUsers() {
    try {
      const [users, me] = await Promise.all([
        apiFunctions.getAllUsers(),
        apiFunctions.getMe(),
      ]);

      setUsers(users);
      setMe(me);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  if (!users || !me) return <Loading />;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          <colgroup>
            <col className="w-1/2" />
            <col className="w-1/2" />
            <col />
            <col />
          </colgroup>
          <tbody>
            {users.map((user: User) => (
              <tr key={user._id}>
                <td className="my-auto flex-1">
                  <div className="text-xl">
                    <span className="font-callsign">{user.username}</span> -{' '}
                    {user.name}
                  </div>{' '}
                  <div className="text-xs opacity-80">{user._id}</div>
                </td>
                <td className="my-auto flex-1">
                  <div className="text-sm opacity-80">Email: {user.email}</div>
                  <div className="text-sm opacity-80">Phone: {user.phone}</div>
                </td>
                <td>
                  <button
                    className={`btn btn-circle btn-warning btn-outline h-14 w-14 border-0 ${
                      user.roles.includes(Role.Admin)
                        ? '!text-warning'
                        : '!text-gray-500'
                    }`}
                    disabled={user._id === me?._id}
                  >
                    <FontAwesomeIcon
                      icon={faCrown}
                      height={20}
                      width={20}
                      className="h-5 w-5 leading-none"
                    />
                  </button>
                </td>
                <td>
                  <button
                    className={`btn btn-circle btn-error btn-outline h-14 w-14 border-0 ${
                      user._id === me?._id ? 'invisible' : ''
                    }`}
                    onClick={() => {
                      setDeleteUser(user);
                      dialogRef.current?.showModal();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      height={20}
                      width={20}
                      className="h-5 w-5 leading-none"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Izbriši uporabnika</h3>
          <p className="py-4">
            Ali si prepričan, da želiš izbrisati uporabnika &quot;
            <strong>{deleteUser?.username}</strong>
            &quot;?
          </p>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-error"
              // onClick={onConfirm}
              onClick={() => {
                apiFunctions
                  .deleteUser(deleteUser!._id)
                  .then(() => {
                    getUsers();
                    dialogRef.current?.close();
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }}
            >
              Izbriši
            </button>
            <form method="dialog">
              <button
                type="button"
                className="btn"
                onClick={() => dialogRef.current?.close()}
              >
                Prekliči
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
