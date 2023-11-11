'use client';

import { apiFunctions } from '@/api';
import { Event } from '@/interfaces/event.interface';
import { useEffect, useState } from 'react';
import { EventComponent } from './event-component';
import { Loading } from '@/components/loading';

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
        console.error(e);
        setEvent(null);
      });
  }, [id]);

  if (event === undefined) return <Loading />;

  if (event === null)
    return (
      <h1 className="text-center text-2xl font-medium">
        404 - Dogodek ne obstaja
      </h1>
    );

  if (event) return <EventComponent event={event} />;

  return null;
}
