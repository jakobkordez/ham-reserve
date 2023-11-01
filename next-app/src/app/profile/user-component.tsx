'use client';

import { apiFunctions } from '@/api';
import { ReservationsTable } from '@/components/reservations-table';
import { Reservation } from '@/interfaces/reservation.interface';
import { useUserState } from '@/state/user-state';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function UserComponent() {
  const [user, getUser] = useUserState((s) => [s.user, s.getUser]);

  useEffect(() => {
    getUser(true).then((u) => {
      if (!u) return window.location.replace('/login');
    });
  }, [getUser]);

  if (!user) return <></>;

  return (
    <>
      <div className="flex gap-2">
        <div className="flex flex-1 flex-col gap-2">
          <div className="text-3xl">{user.name}</div>
          <div className="font-callsign text-2xl">{user.username}</div>

          <div>
            <div>E-mail: {user.email ?? '/'}</div>
            <div>Phone: {user.phone ?? '/'}</div>
          </div>
        </div>
        <Link
          href="/profile/edit"
          className="btn btn-primary btn-sm self-start"
        >
          Uredi profil
        </Link>
      </div>

      <MyReservations />
    </>
  );
}

function MyReservations() {
  const [reservations, setReservations] = useState<Reservation[]>();

  useEffect(() => {
    apiFunctions
      .getReservationsForSelf()
      .then((res) => {
        setReservations(
          res.sort((a, b) => b.forDate.valueOf() - a.forDate.valueOf()),
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div>
      <div className="mb-3 text-2xl">Moje rezervacije</div>

      <ReservationsTable reservations={reservations || []} />
    </div>
  );
}
