import { Reservation } from '@/interfaces/reservation.interface';
import {
  faFileCircleCheck,
  faFileCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

interface ReservationsTableProps {
  reservations: Reservation[];
}

export function ReservationsTable({ reservations }: ReservationsTableProps) {
  return (
    <div className="table w-full border-collapse text-left">
      <div className="table-header-group">
        <div className="table-row border-b-2 border-gray-500">
          <div className="table-cell p-2">Datum</div>
          <div className="table-cell p-2">Frekvenčna področja</div>
          <div className="table-cell p-2">Načini</div>
        </div>
      </div>
      <div className="table-row-group">
        {reservations.map((reservation) => (
          <Link
            href={`/reservation/${reservation._id}`}
            key={reservation._id}
            className="table-row border-b border-gray-700 last:border-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="table-cell p-2">
              {reservation.forDate.toISOString().slice(0, 10)}
            </div>
            <div className="table-cell p-2">
              <div className="flex flex-wrap gap-1">
                {reservation.bands.map((band) => (
                  <div key={band} className="tag">
                    {band}
                  </div>
                ))}
              </div>
            </div>
            <div className="table-cell p-2">
              <div className="flex flex-wrap gap-1">
                {reservation.modes.map((mode) => (
                  <div key={mode} className="tag">
                    {mode}
                  </div>
                ))}
              </div>
            </div>
            <div className="table-cell p-2">
              {reservation.forDate < new Date() && (
                <FontAwesomeIcon
                  icon={
                    reservation.logSummary
                      ? faFileCircleCheck
                      : faFileCircleExclamation
                  }
                  className={
                    reservation.logSummary
                      ? 'text-green-500'
                      : 'text-yellow-300'
                  }
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
