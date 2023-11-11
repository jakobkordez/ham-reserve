'use client';

import { apiFunctions } from '@/api';
import { ReservationsTable } from '@/components/reservations-table';
import { Event } from '@/interfaces/event.interface';
import { Reservation } from '@/interfaces/reservation.interface';
import { useEffect, useState } from 'react';

interface MyReservationsProps {
  event: Event;
}

export function MyReservations({ event }: MyReservationsProps) {
  const [reservations, setReservations] = useState<Reservation[]>();

  useEffect(() => {
    apiFunctions
      .getReservationsForSelf({ event: event._id })
      .then((res) => {
        setReservations(
          res.sort(
            (a, b) => b.startDateTime.valueOf() - a.startDateTime.valueOf(),
          ),
        );
      })
      .catch((e) => {
        console.error(e);
      });
  }, [event._id]);

  return <ReservationsTable reservations={reservations || []} />;
}
