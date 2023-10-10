'use client';

import { Role } from '@/enums/role.enum';
import { useUserState } from '@/state/user-state';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const subPages = [
  {
    name: 'Dogodki',
    href: '/admin/events',
  },
  {
    name: 'Uporabniki',
    href: '/admin/users',
  },
];

export default function AdminPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const getUser = useUserState((s) => s.getUser);

  useEffect(() => {
    getUser().then((u) => {
      if (!u || !u.roles.includes(Role.Admin)) window.location.replace('/');
    });
  }, [getUser]);

  return (
    <>
      <div className="container flex flex-col gap-8 py-10">
        <h1 className="text-4xl font-medium">Admin Page</h1>

        <div className="tabs">
          {subPages.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className={`tab tab-lg tab-bordered ${
                pathname.startsWith(href) ? 'tab-active' : ''
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
