import { Event } from '@/interfaces/event.interface';
import { ProgressBar } from './progress-bar';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="flex h-full flex-col justify-between gap-3 rounded-lg bg-gray-100 px-6 py-4 shadow-md dark:bg-white/5">
      <div>
        <div className="font-callsign text-2xl font-medium">
          {event.callsign}
        </div>

        {event.description && (
          <div className="mt-2 text-sm opacity-80">{event.description}</div>
        )}
      </div>

      {event.fromDateTime && event.toDateTime && (
        <div>
          <div className="mb-1 flex justify-between text-sm">
            <div>{event.fromDateTime.toLocaleDateString()}</div>
            <div>{event.toDateTime.toLocaleDateString()}</div>
          </div>

          <ProgressBar start={event.fromDateTime} end={event.toDateTime} />
        </div>
      )}
    </div>
  );
}
