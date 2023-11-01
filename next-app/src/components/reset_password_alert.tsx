'use client';

import { useUserState } from '@/state/user-state';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useEffect } from 'react';

export function ResetPasswordAlert() {
  const [user, getUser] = useUserState((s) => [s.user, s.getUser]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  if (user?.passwordResetRequired !== true) {
    return null;
  }

  return (
    <div className="alert alert-warning">
      <FontAwesomeIcon
        icon={faWarning}
        width={24}
        height={24}
        className="shrink-0"
      />
      <span>Opozorilo: Prosim zamenjaj geslo!</span>
      <Link href="/profile/edit" className="btn btn-sm">
        Zamenjaj zdaj
      </Link>
    </div>
  );
}
