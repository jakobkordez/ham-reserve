import { Event } from '@/interfaces/event.interface';
import { ProgressBar } from './progress-bar';
import { getUTCDateString, getUTCTimeString } from '@/util/date.util';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="card flex h-full flex-col justify-between gap-3 border border-neutral-200 shadow-lg dark:border-0 dark:bg-neutral dark:text-neutral-content">
      <div className="card-body">
        <div>
          <h1 className="font-callsign card-title mb-1 text-2xl">
            {event.callsign}
          </h1>

          {event.description ? (
            <p>{event.description}</p>
          ) : (
            <p className="font-light italic">Brez opisa</p>
          )}

          {event.fromDateTime && event.fromDateTime > new Date() && (
            <div className="badge badge-primary mt-3 w-full">Začetek kmalu</div>
          )}

          {event.toDateTime && event.toDateTime < new Date() && (
            <div className="badge badge-ghost mt-3 w-full">Zaključeno</div>
          )}
        </div>

        {(event.fromDateTime != undefined) !==
          (event.toDateTime != undefined) && (
          <div className="mt-2 text-sm">
            <span className="font-bold">
              {event.fromDateTime ? 'Od' : 'Do'}:
            </span>{' '}
            {getUTCDateString(event.fromDateTime ?? event.toDateTime!)}{' '}
            {getUTCTimeString(event.fromDateTime ?? event.toDateTime!)}
          </div>
        )}
        {event.fromDateTime && event.toDateTime && (
          <div className="mt-2 text-sm">
            <div className="flex justify-between">
              <div>{getUTCDateString(event.fromDateTime)}</div>
              <div>{getUTCDateString(event.toDateTime)}</div>
            </div>
            <div className="flex justify-between">
              <div>{getUTCTimeString(event.fromDateTime)}</div>
              <div>{getUTCTimeString(event.toDateTime)}</div>
            </div>

            <ProgressBar start={event.fromDateTime} end={event.toDateTime} />
          </div>
        )}
      </div>
    </div>
  );
}
