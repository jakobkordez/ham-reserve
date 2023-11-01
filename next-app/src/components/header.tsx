'use client';

import { Role } from '@/enums/role.enum';
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
          <FontAwesomeIcon
            icon={faMoon}
            width={20}
            height={20}
            className="swap-off h-5 w-5"
          />
          <FontAwesomeIcon
            icon={faSun}
            width={20}
            height={20}
            className="swap-on h-5 w-5"
          />
        </label>
        <UserHeader />
      </div>
    </div>
  );
}

function UserHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, getUser] = useUserState((s) => [s.user, s.getUser]);
  const logout = useAuthState((s) => s.logout);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return user ? (
    <div className="relative">
      <label
        className="header-button flex items-center gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon
          icon={faUserCircle}
          width={20}
          height={20}
          className="h-5 w-5"
        />
        <span>{user.username}</span>
      </label>

      <div
        className={`absolute right-2 top-full z-[1] pt-4 ${
          isOpen ? '' : 'hidden'
        }`}
      >
        <ul className="menu flex w-60 flex-col gap-1 rounded-xl bg-base-100 p-2 text-base-content shadow-md">
          <li>
            <Link href="/profile" onClick={() => setIsOpen(false)}>
              Profil
            </Link>
          </li>
          {user.roles.includes(Role.Admin) && (
            <li>
              <Link
                href="/admin"
                className="btn-warning"
                onClick={() => setIsOpen(false)}
              >
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
