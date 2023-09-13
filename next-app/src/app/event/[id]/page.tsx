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
      .then((res) => {
        setEvent(res.data);
      })
      .catch((e) => {
        console.log(e);
        setEvent(null);
      });
  }, []);

  return (
    <div className="container py-8">
      {event === undefined && <div>Loading...</div>}
      {event === null && (
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-2xl font-medium">404 - Dogodek ne obstaja</h1>
          <Link href="/" className="button">
            Nazaj na domačo stran
          </Link>
        </div>
      )}
      {event && <EventComponent event={event} />}
    </div>
  );
}
