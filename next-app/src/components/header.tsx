'use client';

import { Role } from '@/enums/role.enum';
import { User } from '@/interfaces/user.interface';
import { useAuthState } from '@/state/auth-state';
import { useThemeState } from '@/state/theme-state';
import { useUserState } from '@/state/user-state';
import { faMoon, faSun, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const toggleTheme = useThemeState((s) => s.toggleTheme);

  useEffect(() => {
    setTheme(useThemeState.getState().theme);
    useThemeState.subscribe((s) => setTheme(s.theme));
  }, []);

  return (
    <div className="flex h-16 select-none justify-between bg-primary text-white shadow">
      <Link href="/" className="my-auto ml-4 text-2xl font-semibold">
        Ham Reserve
      </Link>
      <div className="flex">
        <button className="header-button" onClick={toggleTheme}>
          <FontAwesomeIcon
            icon={theme === 'dark' ? faSun : faMoon}
            className="w-4"
          />
        </button>
        <UserHeader />
      </div>
    </div>
  );
}

function UserHeader() {
  const [user, setUser] = useState<User>();
  const getUser = useUserState((s) => s.getUser);
  const logout = useAuthState((s) => s.logout);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getUser().then((u) => setUser(u || undefined));
  }, [getUser]);

  return user ? (
    <div className="relative h-full">
      <button
        className="header-button flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faUserCircle} className="mr-2 h-5" />
        <span>{user.username.toUpperCase()}</span>
      </button>
      <div
        className={`absolute right-2 z-10 mt-2 ${
          isOpen ? '' : 'scale-0 delay-100'
        }`}
      >
        <div
          className={`w-56 origin-top-right rounded-md bg-gray-100 py-2 text-black shadow-sm ring-1 ring-inset ring-primary duration-100 dark:bg-gray-700 dark:text-white ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          <Link
            href="/profile"
            className="block w-full px-4 py-2 text-left hover:bg-black/5 dark:hover:bg-white/10"
            onClick={() => setIsOpen(false)}
          >
            Profil
          </Link>
          {user.roles.includes(Role.Admin) && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-left text-red-500 hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              Admin panel
            </Link>
          )}
          <button
            onClick={() => {
              logout();
              window.location.reload();
            }}
            className="block w-full px-4 py-2 text-left hover:bg-black/5 dark:hover:bg-white/10"
          >
            Odjava
          </button>
        </div>
      </div>
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
