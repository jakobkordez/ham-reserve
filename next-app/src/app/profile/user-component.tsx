'use client';

import { apiFunctions } from '@/api';
import { ReservationsTable } from '@/components/reservations-table';
import { Reservation } from '@/interfaces/reservation.interface';
import { User } from '@/interfaces/user.interface';
import { useUserState } from '@/state/user-state';
import { useEffect, useState } from 'react';

export function UserComponent() {
  const getUser = useUserState((s) => s.getUser);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    getUser().then((u) => {
      if (!u) return window.location.replace('/login');
      setUser(u);
    });
  }, [getUser]);

  if (!user) return <></>;

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="text-3xl">{user.name}</div>
        <div className="font-callsign text-2xl">{user.username}</div>

        <div>
          <div>E-mail: {user.email ?? '/'}</div>
          <div>Phone: {user.phone ?? '/'}</div>
        </div>
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
