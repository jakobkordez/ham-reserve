'use client';

import { apiFunctions } from '@/api';
import { Event } from '@/interfaces/event.interface';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EventCard } from './event-card';

export function CurrentEvents() {
  const [events, setEvents] = useState<Event[]>();

  useEffect(() => {
    apiFunctions.getCurrentEvents().then((res) => setEvents(res.data));
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl">Trenutni dogodki</h2>

      {(events?.length ?? 0) === 0 ? (
        <p className="opacity-90">Yoooo, no events, come back another day</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events?.map((event, i) => (
            <Link key={i} href={`/event/${event._id}`}>
              <EventCard event={event} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
