'use client';
import { apiFunctions } from '@/api';
import { Event } from '@/interfaces/event.interface';
import { Reservation } from '@/interfaces/reservation.interface';
import { dayInMs, hourInMs } from '@/util/date.util';
import { useEffect, useState } from 'react';
import { Band, COMMON_BANDS } from '@/enums/band.enum';
import { Mode } from '@/enums/mode.enum';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

export function FreeDatesComponent({ event }: { event: Event }) {
  const [reservations, setReservations] = useState<Reservation[]>();

  const [date, setDate] = useState<string>(
    new Date().toISOString().slice(0, 10),
  );
  const [band, setBand] = useState<Band>();
  const [mode, setMode] = useState<Mode>();

  const bands = band
    ? [band.toString()]
    : COMMON_BANDS.map((band) => band.toString());

  useEffect(() => {
    setReservations(undefined);
    apiFunctions
      .getReservationsForEvent(event._id, {
        start: date,
        end: new Date(new Date(date).valueOf() + dayInMs).toISOString(),
      })
      .then(setReservations)
      .catch(console.error);
  }, [event._id, date]);

  const freeTable = bands.map(() =>
    new Array<Set<string> | null>(24)
      .fill(null)
      .map(() => (reservations == undefined ? null : new Set<string>())),
  );

  const dateV = new Date(date).valueOf() / hourInMs;
  if (reservations) {
    for (const reservation of reservations) {
      if (mode && !reservation.modes.includes(mode)) continue;

      const start = Math.max(
        Math.floor(reservation.startDateTime.valueOf() / hourInMs),
        dateV,
      );
      const end = Math.min(
        Math.ceil(reservation.endDateTime.valueOf() / hourInMs),
        dateV + 24,
      );

      for (let i = start; i < end; ++i) {
        const timeI = i - dateV;
        if (timeI < 0 || timeI > 23) {
          console.error('Invalid hour', i);
          continue;
        }
        for (const band of reservation.bands) {
          if (!bands.includes(band)) continue;
          for (const mode of reservation.modes) {
            freeTable[bands.indexOf(band)][timeI]?.add(mode);
          }
        }
      }
    }
  }

  return (
    <div className="flex flex-col gap-5 md:flex-row">
      <div className="flex flex-1 flex-col justify-start gap-3 px-6 py-2 md:border-r">
        <h3 className="label border-b text-xl font-bold">Filtri</h3>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Datum</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={date}
            min={event.fromDateTime?.toISOString().slice(0, 10)}
            max={event.toDateTime?.toISOString().slice(0, 10)}
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return;
              setDate(val);
            }}
          />
          <div className="mt-2 flex gap-2">
            <button
              className="btn btn-primary btn-sm flex-1"
              onClick={() => {
                const d = new Date(date);
                d.setDate(d.getDate() - 1);
                setDate(d.toISOString().slice(0, 10));
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <button
              className="btn btn-primary btn-sm flex-1"
              onClick={() => {
                const d = new Date(date);
                d.setDate(d.getDate() + 1);
                setDate(d.toISOString().slice(0, 10));
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Frekvenčni pas</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={band?.toString() ?? ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val == '') setBand(undefined);
              else setBand(val as Band);
            }}
          >
            <option value="">---</option>
            {Object.values(Band).map((band) => (
              <option key={band}>{band}</option>
            ))}
          </select>
          <label className="label">
            <span className="label-text-alt">
              Tukaj se nahajajo vsi frekvenčni pasovi
            </span>
          </label>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Način</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={mode?.toString() ?? ''}
            onChange={(e) => {
              const val = e.target.value;
              if (val == '') setMode(undefined);
              else setMode(val as Mode);
            }}
          >
            <option value="">Vsi</option>
            {Object.values(Mode).map((mode) => (
              <option key={mode}>{mode}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-[2]">
        <table className="table mx-auto w-auto">
          <tbody>
            <tr>
              <td />
              <td>
                <div className="flex">
                  <div className="w-12 border-l border-base-300 pl-1">0</div>
                  <div className="w-12 border-l border-base-300 pl-1">4</div>
                  <div className="w-12 border-l border-base-300 pl-1">8</div>
                  <div className="w-12 border-l border-base-300 pl-1">12</div>
                  <div className="w-12 border-l border-base-300 pl-1">16</div>
                  <div className="w-12 border-l border-base-300 pl-1">20</div>
                </div>
              </td>
            </tr>

            {bands.map((band, bi) => (
              <tr key={band}>
                <th key={band} className="px-3 py-2">
                  {band}
                </th>
                <td>
                  <div className="flex">
                    {freeTable[bi].map((taken, i) => (
                      <div
                        key={i}
                        className={`tooltip m-auto h-3 w-3 border-l border-base-200 first:rounded-l-full first:border-0 last:rounded-r-full ${
                          taken == null
                            ? 'bg-base-200'
                            : taken.size == 0
                            ? 'bg-green-500/90'
                            : mode || taken.size == Object.values(Mode).length
                            ? 'bg-red-500/90'
                            : 'bg-yellow-500/90'
                        }`}
                        data-tip={`${formatTime(i)} - ${formatTime(i + 1)} UTC`}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatTime(hour: number) {
  return `${hour.toString().padStart(2, '0')}:00`;
}
