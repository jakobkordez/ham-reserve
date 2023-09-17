'use client';

import { apiFunctions } from '@/api';
import { Reservation } from '@/interfaces/reservation.interface';
import { useAuthState } from '@/state/auth-state';
import { useEffect, useState } from 'react';
import { ReservationComponent } from './reservation-component';
import Link from 'next/link';
import { Event } from '@/interfaces/event.interface';

interface ReservationPageProps {
  params: {
    id: string;
  };
}

export default function ReservationPage({
  params: { id },
}: ReservationPageProps) {
  const [reservation, setReservation] = useState<Reservation | null>();
  const [event, setEvent] = useState<Event | null>();
  const getAccessToken = useAuthState((state) => state.getAccessToken);

  useEffect(() => {
    getAccessToken().then((token) => {
      if (!token) return;
      apiFunctions
        .getReservation(token, id)
        .then((res) => {
          setReservation(res.data);
          apiFunctions
            .getEvent(res.data.event)
            .then((res) => {
              setEvent(res.data);
            })
            .catch((e) => {
              console.log(e);
              setEvent(null);
            });
        })
        .catch((e) => {
          console.log(e);
          setReservation(null);
        });
    });
  }, [id, getAccessToken]);

  return (
    <div className="container py-10">
      {reservation === undefined && <div>Loading...</div>}
      {reservation === null && (
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-2xl font-medium">404 - Rezervacija ne obstaja</h1>
          <Link href="/" className="button">
            Nazaj na domačo stran
          </Link>
        </div>
      )}
      {reservation && event && (
        <ReservationComponent reservation={reservation} event={event} />
      )}
    </div>
  );
}
