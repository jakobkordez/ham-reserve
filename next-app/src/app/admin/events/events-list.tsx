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
    <div className="overflow-x-auto">
      <table className="table">
        <colgroup>
          <col className="w-1/2" />
          <col className="w-1/2" />
          <col />
        </colgroup>
        <tbody>
          {events?.map((event) => (
            <tr key={event._id}>
              <td className="flex flex-1 items-center gap-3">
                <div className="font-callsign text-2xl font-medium">
                  {event.callsign}
                </div>

                {event.isPrivate && <PrivateTag />}
              </td>

              <td className="flex-1 text-sm opacity-80">
                <div>Od: {event.fromDateTime?.toLocaleDateString() ?? '/'}</div>
                <div>Do: {event.toDateTime?.toLocaleDateString() ?? '/'}</div>
              </td>

              <th>
                <Link
                  href={`/admin/events/${event._id}`}
                  className="btn btn-ghost btn-sm"
                >
                  Več
                </Link>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
