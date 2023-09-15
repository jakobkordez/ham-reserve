'use client';

import { PrivateTag } from '@/components/private-tag';
import { ProgressBar } from '@/components/progress-bar';
import { Event } from '@/interfaces/event.interface';
import { getUTCString } from '@/util/date.util';
import { ReserveComponent } from './reserve-component';
import { FreeDatesComponent } from './free-dates-component';

interface EventComponentProps {
  event: Event;
}

export function EventComponent({ event }: EventComponentProps) {
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

      <div>
        <h2 className="mb-4 text-2xl">Rezervacija</h2>
        <ReserveComponent event={event} />
      </div>
    </div>
  );
}
