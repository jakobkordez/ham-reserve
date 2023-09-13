'use client';

import Link from 'next/link';
import { UsersList } from './users-list';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

export default function AdminUsers() {
  return (
    <div>
      <div className="mb-4 flex items-center">
        <h2 className="flex-1 text-2xl font-medium">Users</h2>

        <Link href="/admin/users/create">
          <FontAwesomeIcon icon={faAdd} className="text-2xl" />
        </Link>
      </div>

      <UsersList />
    </div>
  );
}
