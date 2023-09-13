'use client';

import { PrivateTag } from '@/components/private-tag';
import { ProgressBar } from '@/components/progress-bar';
import { Event } from '@/interfaces/event.interface';
import { useAuthState } from '@/state/auth-state';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface EventComponentProps {
  event: Event;
}

const bands = ['160m', '80m', '40m', '20m', '15m', '10m', '6m', '2m', '70cm'];

export function EventComponent({ event }: EventComponentProps) {
  const [isAuth, setIsAuth] = useState(false);
  const isValid = useAuthState((state) => state.isValid);

  useEffect(() => {
    isValid().then(setIsAuth);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex flex-col items-start gap-2">
          <h1 className="font-callsign text-4xl font-medium">
            {event.callsign}
          </h1>
          <p className="opacity-90">{event.description}</p>
          {event.isPrivate && <PrivateTag />}
        </div>

        {event.fromDateTime && event.toDateTime && (
          <div className="mt-4">
            <div className="mb-2 flex justify-between">
              <div>{event.fromDateTime.toLocaleString()}</div>
              <div>{event.toDateTime.toLocaleString()}</div>
            </div>
            <ProgressBar start={event.fromDateTime} end={event.toDateTime} />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {isAuth ? (
          <Link href={`${event._id}/reserve`} className="button">
            Rezerviraj zdaj
          </Link>
        ) : (
          <Link href="/login" className="button">
            Prijavi se za rezervacijo
          </Link>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-2xl">Prosti termini</h2>

        <table className="block w-full overflow-x-auto whitespace-nowrap pb-2 text-center lg:table">
          <thead>
            <tr>
              <td />
              {new Array(11).fill(null).map((_, i) => (
                <th key={i} className="px-3">
                  {new Date(Date.now() + i * 1000 * 60 * 60 * 24)
                    .toLocaleDateString()
                    .slice(0, -5)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {bands.map((band) => (
              <tr>
                <th key={band} className="px-3">
                  {band}
                </th>
                {new Array(11).fill(null).map((_, i) => (
                  <td key={i}>
                    <div
                      className={`m-auto h-3 w-full${
                        i > 0 ? '' : ' rounded-l-full'
                      }${i == 10 ? ' rounded-r-full' : ''} ${
                        Math.random() > 0.2 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
