import { Event } from '@/interfaces/event.interface';
import { ProgressBar } from './progress-bar';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="card bg-base-100 flex h-full flex-col justify-between gap-3 border border-primary shadow-xl">
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
        </div>

        {(event.fromDateTime != undefined) !==
          (event.toDateTime != undefined) && (
          <div>
            {event.fromDateTime ? 'Od' : 'Do'}:{' '}
            {(event.fromDateTime ?? event.toDateTime!).toLocaleDateString()}
          </div>
        )}
        {event.fromDateTime && event.toDateTime && (
          <div className="mt-2">
            <div className="flex justify-between text-sm">
              {event.fromDateTime && (
                <div>{event.fromDateTime.toLocaleDateString()}</div>
              )}
              {event.toDateTime && (
                <div>{event.toDateTime.toLocaleDateString()}</div>
              )}
            </div>

            <ProgressBar start={event.fromDateTime} end={event.toDateTime} />
          </div>
        )}
      </div>
    </div>
  );
}
