'use client';

import { apiFunctions } from '@/api';
import { Event } from '@/interfaces/event.interface';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EventCard } from './event-card';

export function PrivateEvents() {
  const [events, setEvents] = useState<Event[]>();

  useEffect(() => {
    apiFunctions.getPrivateEvents().then(setEvents).catch(console.log);
  }, []);

  if ((events?.length ?? 0) === 0) return <></>;

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">Private</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events?.map((event, i) => (
          <Link key={i} href={`/event/${event._id}`}>
            <EventCard event={event} />
          </Link>
        ))}
      </div>
    </div>
  );
}
