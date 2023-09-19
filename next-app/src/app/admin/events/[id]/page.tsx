'use client';

import { apiFunctions } from '@/api';
import { Event } from '@/interfaces/event.interface';
import { useEffect, useState } from 'react';
import { EventComponent } from './event-component';

interface EventPageProps {
  params: {
    id: string;
  };
}

export default function AdminEventPage({ params: { id } }: EventPageProps) {
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
    <>
      {event === undefined && <div>Loading...</div>}
      {event === null && (
        <h1 className="text-center text-2xl font-medium">
          404 - Dogodek ne obstaja
        </h1>
      )}
      {event && <EventComponent event={event} />}
    </>
  );
}
