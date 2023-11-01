'use client';

import { apiFunctions } from '@/api';
import { Reservation } from '@/interfaces/reservation.interface';
import { useEffect, useState } from 'react';
import { ReservationComponent } from './reservation-component';
import Link from 'next/link';
import { Event } from '@/interfaces/event.interface';
import { Loading } from '@/components/loading';

interface ReservationPageProps {
  params: {
    id: string;
  };
}

export default function ReservationPage({
  params: { id },
}: ReservationPageProps) {
  return (
    <div className="container py-10">
      <_ReservationComponent params={{ id }} />
    </div>
  );
}

function _ReservationComponent({ params: { id } }: ReservationPageProps) {
  const [reservation, setReservation] = useState<Reservation | null>();
  const [event, setEvent] = useState<Event | null>();

  // TODO Server populate
  useEffect(() => {
    apiFunctions
      .getReservation(id)
      .then((res) => {
        setReservation(res);
        apiFunctions
          .getEvent(res.event)
          .then(setEvent)
          .catch((e) => {
            console.error(e);
            setEvent(null);
          });
      })
      .catch((e) => {
        console.error(e);
        setReservation(null);
      });
  }, [id]);

  if (reservation === undefined) return <Loading />;

  if (reservation === null)
    return (
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-medium">404 - Rezervacija ne obstaja</h1>
        <Link href="/" className="btn btn-primary">
          Nazaj na domačo stran
        </Link>
      </div>
    );

  if (reservation && event)
    return <ReservationComponent reservation={reservation} event={event} />;

  return null;
}
