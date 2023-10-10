'use client';

import { apiFunctions } from '@/api';
import { Event } from '@/interfaces/event.interface';
import { useEffect, useState } from 'react';
import { EventComponent } from './event-component';
import Link from 'next/link';

interface EventPageProps {
  params: {
    id: string;
  };
}

export default function EventPage({ params: { id } }: EventPageProps) {
  const [event, setEvent] = useState<Event | null>();

  useEffect(() => {
    apiFunctions
      .getEvent(id)
      .then(setEvent)
      .catch((e) => {
        console.log(e);
        setEvent(null);
      });
  }, [id]);

  return (
    <div className="container py-10">
      {event === undefined && <div>Loading...</div>}
      {event === null && (
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-2xl font-medium">404 - Dogodek ne obstaja</h1>
          <Link href="/" className="btn btn-primary">
            Nazaj na domačo stran
          </Link>
        </div>
      )}
      {event && <EventComponent event={event} />}
    </div>
  );
}
