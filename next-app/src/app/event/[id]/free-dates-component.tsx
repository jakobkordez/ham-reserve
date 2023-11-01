'use client';
import { apiFunctions } from '@/api';
import { Event } from '@/interfaces/event.interface';
import { Reservation } from '@/interfaces/reservation.interface';
import { dayInMs, dayInWeeks, getNextNDays } from '@/util/date.util';
import { useEffect, useState } from 'react';
import { Band } from '@/enums/band.enum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

export function FreeDatesComponent({ event }: { event: Event }) {
  const [reservations, setReservations] = useState<Reservation[]>();
  const [offset, setOffset] = useState(0);

  const bands = Object.values(Band).map((val) => val.toString());
  const dates = getNextNDays(7, event, offset);

  const start = dates[0]?.toISOString();
  const end = dates[dates.length - 1]?.toISOString();

  useEffect(() => {
    apiFunctions
      .getReservationsForEvent(event._id, {
        start,
        end,
      })
      .then(setReservations)
      .catch(console.error);
  }, [event._id, start, end]);

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
    <div className="overflow-x-auto">
      <div className="join mb-2 w-full rounded-full shadow-md">
        <button
          className="btn btn-circle join-item btn-sm"
          onClick={() => setOffset(offset - 7)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <div className="join-item flex w-full bg-base-200">
          <div className="m-auto">
            {dates[0]?.toLocaleDateString('sl')} -{' '}
            {dates[dates.length - 1]?.toLocaleDateString('sl')}
          </div>
        </div>
        <button
          className="btn btn-circle join-item btn-sm"
          onClick={() => setOffset(offset + 7)}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      <table className="table">
        <colgroup>
          <col style={{ width: 1 / 8 }} />
          <col style={{ width: 1 / 8 }} />
          <col style={{ width: 1 / 8 }} />
          <col style={{ width: 1 / 8 }} />
          <col style={{ width: 1 / 8 }} />
          <col style={{ width: 1 / 8 }} />
          <col style={{ width: 1 / 8 }} />
          <col style={{ width: 1 / 8 }} />
        </colgroup>
        <thead>
          <tr>
            <td />
            {dates.map((date, i) => (
              <th key={i} className="px-3">
                <div>{dayInWeeks[date.getUTCDay()]}</div>
                <div>
                  {date.getUTCDate()}. {date.getUTCMonth() + 1}.
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Object.values(Band).map((band, bi) => (
            <tr key={band}>
              <th key={band} className="px-3 py-2">
                {band}
              </th>
              {freeTable[bi].map((isFree, i) => (
                <td key={i} className="p-px">
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
    </div>
  );
}
