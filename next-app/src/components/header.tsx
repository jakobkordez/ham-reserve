'use client';

import { Role } from '@/enums/role.enum';
import { User } from '@/interfaces/user.interface';
import { useAuthState } from '@/state/auth-state';
import { THEME_DARK, useThemeState } from '@/state/theme-state';
import { useUserState } from '@/state/user-state';
import { faMoon, faSun, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function Header() {
  const [theme, setTheme] = useState<string>(THEME_DARK);
  const toggleTheme = useThemeState((s) => s.toggleTheme);

  useEffect(() => {
    setTheme(useThemeState.getState().theme);
    useThemeState.subscribe((s) => setTheme(s.theme));
  }, []);

  return (
    <div className="flex h-16 select-none justify-between border-b border-primary">
      <Link href="/" className="my-auto ml-4 text-2xl font-semibold">
        Ham Reserve
      </Link>
      <div className="flex">
        <label className="header-button swap swap-rotate">
          <input
            type="checkbox"
            checked={theme === THEME_DARK}
            onChange={toggleTheme}
          />
          <FontAwesomeIcon icon={faMoon} className="swap-off h-5 w-5" />
          <FontAwesomeIcon icon={faSun} className="swap-on h-5 w-5" />
        </label>
        <UserHeader />
      </div>
    </div>
  );
}

function UserHeader() {
  const [user, setUser] = useState<User>();
  const getUser = useUserState((s) => s.getUser);
  const logout = useAuthState((s) => s.logout);

  useEffect(() => {
    getUser().then((u) => setUser(u || undefined));
  }, [getUser]);

  return user ? (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="header-button flex items-center">
        <FontAwesomeIcon icon={faUserCircle} className="mr-2 h-5" />
        <span>{user.username.toUpperCase()}</span>
      </label>
      <ul
        tabIndex={0}
        className="menu dropdown-content rounded-box z-[1] mr-4 mt-4 w-52 border bg-base-100 p-2 shadow"
      >
        <li>
          <Link href="/profile">Profil</Link>
        </li>
        {user.roles.includes(Role.Admin) && (
          <li>
            <Link href="/admin" className="text-warning">
              Admin panel
            </Link>
          </li>
        )}
        <li>
          <button
            onClick={() => {
              logout();
              window.location.reload();
            }}
          >
            Odjava
          </button>
        </li>
      </ul>
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
