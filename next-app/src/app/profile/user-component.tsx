'use client';

import { apiFunctions } from '@/api';
import { Reservation } from '@/interfaces/reservation.interface';
import { User } from '@/interfaces/user.interface';
import { useAuthState } from '@/state/auth-state';
import { useEffect, useState } from 'react';

export function UserComponent() {
  const getUser = useAuthState((s) => s.getUser);
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
  const getAccessToken = useAuthState((s) => s.getAccessToken);
  const [reservations, setReservations] = useState<Reservation[]>();

  useEffect(() => {
    getAccessToken().then((token) => {
      if (!token) return;
      apiFunctions
        .getReservationsForSelf(token)
        .then((res) => {
          setReservations(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }, [getAccessToken]);

  return (
    <div>
      <div className="mb-2 text-2xl">Moje rezervacije</div>
      <div>
        {reservations?.map((e) => (
          <div
            key={e._id}
            className="flex items-center gap-3 border-b px-3 py-2 last:border-0"
          >
            <div>{e.forDate.toISOString().slice(0, 10)}</div>
            <div className="flex gap-1">
              {e.bands.map((band) => (
                <div key={band} className="rounded bg-gray-800 px-2 py-0.5">
                  {band}
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              {e.modes.map((mode) => (
                <div key={mode} className="rounded bg-gray-800 px-2 py-0.5">
                  {mode}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
