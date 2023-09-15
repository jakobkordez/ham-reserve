'use client';
import { apiFunctions } from '@/api';
import { Event } from '@/interfaces/event.interface';
import { Reservation } from '@/interfaces/reservation.interface';
import { dayInMs, dayInWeeks } from '@/util/date.util';
import { useEffect, useState } from 'react';
import { Band } from '@/enums/band.enum';

export function FreeDatesComponent({ event }: { event: Event }) {
  const [reservations, setReservations] = useState<Reservation[]>();

  useEffect(() => {
    apiFunctions
      .getReservationsForEvent(event._id)
      .then((res) => setReservations(res.data))
      .catch(console.error);
  }, [event._id]);

  const bands = Object.values(Band).map((val) => val.toString());
  const dates = new Array(7)
    .fill(null)
    .map((_, i) => new Date((Date.now() / dayInMs) * dayInMs + i * dayInMs));

  const freeTable = bands.map(() => dates.map(() => true));

  for (const reservation of reservations ?? []) {
    const forDateDay = reservation.forDate.valueOf() / dayInMs;
    for (const band of reservation.bands) {
      if (!bands.includes(band)) continue;
      const dateI = dates.findIndex(
        (val) => Math.floor(val.valueOf() / dayInMs) == forDateDay,
      );
      if (dateI == -1) continue;
      freeTable[bands.indexOf(band)][dateI] = false;
    }
  }

  return (
    <table className="block w-full overflow-x-auto whitespace-nowrap pb-2 text-center sm:table">
      <thead>
        <tr>
          <td className="text-right">
            {/* <button className="h-8 w-8 rounded-full bg-gray-500">
              <FontAwesomeIcon icon={faChevronLeft} />
            </button> */}
          </td>
          {dates.map((date, i) => (
            <th key={i} className="px-3">
              <div>{dayInWeeks[date.getUTCDay()]}</div>
              <div>
                {date.getUTCDate()}/{date.getUTCMonth() + 1}
              </div>
            </th>
          ))}
          {/* <td className="text-left">
              <button className="h-8 w-8 rounded-full bg-gray-500">
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </td> */}
        </tr>
      </thead>

      <tbody>
        {Object.values(Band).map((band, bi) => (
          <tr key={band}>
            <th key={band} className="px-3">
              {band}
            </th>
            {freeTable[bi].map((isFree, i) => (
              <td key={i}>
                <div
                  className={`m-auto h-3 w-full${
                    i > 0 ? '' : ' rounded-l-full'
                  }${i == dates.length - 1 ? ' rounded-r-full' : ''} ${
                    isFree ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
