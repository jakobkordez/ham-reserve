'use client';

import { apiFunctions } from '@/api';
import { User } from '@/interfaces/user.interface';
import { useAuthState } from '@/state/auth-state';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef } from 'react';

export function DeleteUserDialog({
  user,
  onCancel,
}: {
  user: User | undefined;
  onCancel: () => void;
}) {
  const getAccessToken = useAuthState((s) => s.getAccessToken);

  const cancelButtonRef = useRef(null);

  return (
    <Dialog
      as="div"
      open={!!user}
      className="relative z-10"
      initialFocus={cancelButtonRef}
      onClose={onCancel}
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-75" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Deactivate account
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to deactivate the account "
                      <strong className="text-black">{user?.username}</strong>
                      "? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 pb-5 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={async () => {
                  const token = await getAccessToken();
                  if (!token) return;
                  apiFunctions.deleteUser(token, user!._id);
                  onCancel();
                }}
              >
                Deactivate
              </button>
              <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={onCancel}
                ref={cancelButtonRef}
              >
                Cancel
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
