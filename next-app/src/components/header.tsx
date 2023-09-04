'use client';

import { User } from '@/interfaces/user.interface';
import { useAuthState } from '@/state/auth-state';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Header() {
  return (
    <div className="flex h-16 select-none flex-row justify-between bg-gray-100 shadow dark:bg-[#454545]">
      <Link href="/" className="my-auto ml-4 text-2xl font-semibold">
        Ham Reserve
      </Link>
      <div className="flex flex-row gap-4">
        <UserHeader />
      </div>
    </div>
  );
}

function UserHeader() {
  const [user, setUser] = useState<User>();
  const [getUser, logout] = useAuthState((s) => [s.getUser, s.logout]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getUser().then((u) => setUser(u || undefined));
  }, []);

  return user ? (
    <div className="relative h-full">
      <button
        className="flex h-full items-center p-6 hover:bg-white/20"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>{user.username.toUpperCase()}</div>
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-md border-gray-500 bg-white/20 py-2 shadow-md">
          <button
            onClick={() => {
              logout();
              window.location.reload();
            }}
            className="w-full px-4 py-2 text-left hover:bg-white/10"
          >
            Odjava
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className="relative h-full">
      <Link
        href="/login"
        className="flex h-full items-center p-6 hover:bg-white/20"
      >
        Prijava
      </Link>
    </div>
  );
}
