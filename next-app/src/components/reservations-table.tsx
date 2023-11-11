import { Reservation } from '@/interfaces/reservation.interface';
import { getUTCString } from '@/util/date.util';
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
    <table className="table">
      <colgroup>
        {/* <col style={{ width: '30%' }} /> */}
        <col />
        <col style={{ width: '30%' }} />
        <col style={{ width: '30%' }} />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th>Čas</th>
          <th>Frekvenčna področja</th>
          <th>Načini</th>
        </tr>
      </thead>
      <tbody>
        {reservations.map((reservation) => (
          <tr key={reservation._id}>
            <td>
              {getUTCString(reservation.startDateTime)} -<br />
              {getUTCString(reservation.endDateTime)}
            </td>
            <td>
              <div className="flex flex-wrap gap-1">
                {reservation.bands.join(', ')}
              </div>
            </td>
            <td>
              <div className="flex flex-wrap gap-1">
                {reservation.modes.join(', ')}
              </div>
            </td>
            <td>
              {reservation.startDateTime < new Date() && (
                <FontAwesomeIcon
                  icon={
                    reservation.logSummary
                      ? faFileCircleCheck
                      : faFileCircleExclamation
                  }
                  className={`h-5 w-5 ${
                    reservation.logSummary
                      ? 'text-green-400'
                      : 'text-orange-300'
                  }`}
                />
              )}
            </td>
            <td>
              <Link
                href={`/reservation/${reservation._id}`}
                className="btn btn-sm"
              >
                Več
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
