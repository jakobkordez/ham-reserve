'use client';

import { apiFunctions } from '@/api';
import { PrivateTag } from '@/components/private-tag';
import { Event } from '@/interfaces/event.interface';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function EventsList() {
  const [events, setEvents] = useState<Event[]>();

  useEffect(() => {
    apiFunctions.getAllEvents().then(setEvents).catch(console.error);
  }, []);

  return (
    <div className="flex flex-col">
      {events?.map((event) => (
        <Link
          key={event._id}
          href={`/admin/events/${event._id}`}
          className="flex border-b border-gray-500 px-4 py-3 align-middle transition last:border-none hover:bg-gray-500/10"
        >
          <div className="flex flex-1 items-center gap-3">
            <div className="font-callsign text-2xl font-medium">
              {event.callsign}
            </div>

            {event.isPrivate && <PrivateTag />}
          </div>

          <div className="flex-1 text-sm opacity-80">
            <div>Od: {event.fromDateTime?.toLocaleDateString() ?? '/'}</div>
            <div>Do: {event.toDateTime?.toLocaleDateString() ?? '/'}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
