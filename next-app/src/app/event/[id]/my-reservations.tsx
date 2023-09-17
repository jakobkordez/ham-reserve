'use client';

import { apiFunctions } from '@/api';
import { ReservationsTable } from '@/components/reservations-table';
import { Event } from '@/interfaces/event.interface';
import { Reservation } from '@/interfaces/reservation.interface';
import { useAuthState } from '@/state/auth-state';
import { useEffect, useState } from 'react';

interface MyReservationsProps {
  event: Event;
}

export function MyReservations({ event }: MyReservationsProps) {
  const [reservations, setReservations] = useState<Reservation[]>();
  const getAccessToken = useAuthState((state) => state.getAccessToken);

  useEffect(() => {
    getAccessToken().then((token) => {
      if (!token) return;
      apiFunctions
        .getReservationsForSelf(token, { event: event._id })
        .then((res) => {
          setReservations(
            res.data.sort((a, b) => b.forDate.valueOf() - a.forDate.valueOf()),
          );
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }, [event._id, getAccessToken]);

  return <ReservationsTable reservations={reservations || []} />;
}
