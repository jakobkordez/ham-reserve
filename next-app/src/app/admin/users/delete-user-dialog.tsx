'use client';

import { User } from '@/interfaces/user.interface';

interface DeleteUserDialogProps {
  user: User | undefined;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteUserDialog({ user }: DeleteUserDialogProps) {
  return (
    <dialog id="delete_user" className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">Izbriši uporabnika</h3>
        <p className="py-4">
          Are you sure you want to deactivate the account &quot;
          <strong className="text-black">{user?.username}</strong>
          &quot;? This action cannot be undone.
        </p>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
