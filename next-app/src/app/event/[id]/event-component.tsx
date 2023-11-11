'use client';

import { PrivateTag } from '@/components/private-tag';
import { ProgressBar } from '@/components/progress-bar';
import { Event } from '@/interfaces/event.interface';
import { getUTCString } from '@/util/date.util';
import { ReserveComponent } from './reserve-component';
import { FreeDatesComponent } from './free-dates-component';
import { MyReservations } from './my-reservations';
import { User } from '@/interfaces/user.interface';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserState } from '@/state/user-state';
import { Role } from '@/enums/role.enum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

interface EventComponentProps {
  event: Event;
}

export function EventComponent({ event }: EventComponentProps) {
  const [user, setUser] = useState<User | null>();
  const getUser = useUserState((state) => state.getUser);

  useEffect(() => {
    getUser().then(setUser);
  }, [getUser]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex justify-between">
          <div className="flex flex-col items-start gap-2">
            <h1 className="font-callsign text-4xl font-medium">
              {event.callsign}
            </h1>
            <p className="opacity-90">{event.description}</p>
            {event.isPrivate && <PrivateTag />}
          </div>
          <EditButton id={event._id} />
        </div>

        {event.fromDateTime && event.toDateTime && (
          <div className="mt-4">
            <div className="mb-2 flex justify-between">
              <div>{getUTCString(event.fromDateTime)}</div>
              <div>{getUTCString(event.toDateTime)}</div>
            </div>
            <ProgressBar start={event.fromDateTime} end={event.toDateTime} />
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-2xl">Prosti termini</h2>
        <FreeDatesComponent event={event} />
      </div>

      {user ? (
        <>
          <div>
            <h2 className="mb-4 text-2xl">Moje rezervacije</h2>
            <MyReservations event={event} />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl">Nova rezervacija</h2>
            <div className="alert">
              <FontAwesomeIcon
                icon={faInfoCircle}
                className="shrink-0 text-primary"
              />
              Trenutni čas: <Time />
            </div>
            <ReserveComponent event={event} />
          </div>
        </>
      ) : (
        <div>
          <Link
            href={`/login?redirect=/event/${event._id}`}
            className="btn btn-primary"
          >
            Prijavi se za rezervacijo
          </Link>
        </div>
      )}
    </div>
  );
}

function EditButton({ id }: { id: string }) {
  const user = useUserState((s) => s.user);
  if (!user || !user.roles.includes(Role.Admin)) return null;

  return (
    <Link href={`/admin/events/${id}`} className="btn btn-warning btn-sm">
      Uredi
    </Link>
  );
}

function Time() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <>{getUTCString(time)}</>;
}
