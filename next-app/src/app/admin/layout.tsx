'use client';

import { Role } from '@/enums/role.enum';
import { useAuthState } from '@/state/auth-state';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const subPages = [
  {
    name: 'Events',
    href: '/admin/events',
  },
  {
    name: 'Users',
    href: '/admin/users',
  },
];

export default function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const getUser = useAuthState((s) => s.getUser);

  useEffect(() => {
    getUser().then((u) => {
      if (!u || !u.roles.includes(Role.Admin)) window.location.replace('/');
    });
  }, []);

  return (
    <>
      <div className="container flex flex-col gap-8 py-10">
        <h1 className="text-4xl font-medium">Admin Page</h1>

        <div className="flex flex-row flex-wrap gap-3">
          {subPages.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-md border border-gray-300 px-5 py-2 font-medium shadow dark:border-gray-600 ${
                href === pathname
                  ? 'bg-black/10 dark:bg-white/20'
                  : 'bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20'
              }`}
            >
              {name}
            </Link>
          ))}
        </div>

        {children}
      </div>
    </>
  );
}
