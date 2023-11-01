'use client';

import { apiFunctions } from '@/api';
import { Event } from '@/interfaces/event.interface';
import { useEffect, useState } from 'react';
import { EventComponent } from './event-component';
import Link from 'next/link';
import { Loading } from '@/components/loading';

interface EventPageProps {
  params: {
    id: string;
  };
}

export default function EventPage({ params: { id } }: EventPageProps) {
  return (
    <div className="container py-10">
      <_EventComponent params={{ id }} />
    </div>
  );
}

function _EventComponent({ params: { id } }: EventPageProps) {
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

  if (event === undefined) return <Loading />;

  if (event === null)
    return (
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-medium">404 - Dogodek ne obstaja</h1>
        <Link href="/" className="btn btn-primary">
          Nazaj na domačo stran
        </Link>
      </div>
    );

  if (event) return <EventComponent event={event} />;

  return null;
}
