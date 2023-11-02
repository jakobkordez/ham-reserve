'use client';

import { apiFunctions } from '@/api';
import { Band } from '@/enums/band.enum';
import { Mode } from '@/enums/mode.enum';
import { Event } from '@/interfaces/event.interface';
import { User } from '@/interfaces/user.interface';
import { useUserState } from '@/state/user-state';
import { getNextNDays, getUTCDMString } from '@/util/date.util';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

interface ReserveComponentProps {
  event: Event;
}

export function ReserveComponent({ event }: ReserveComponentProps) {
  const dateRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>();
  const getUser = useUserState((state) => state.getUser);

  const [date, setDate] = useState<Date>();
  const [bands, setBands] = useState<Set<Band>>(new Set());
  const [modes, setModes] = useState<Set<Mode>>(new Set());
  const [error, setError] = useState<string>();

  useEffect(() => {
    getUser().then(setUser);
  }, [getUser]);

  if (!user) return <></>;

  if (!event.access.includes(user._id))
    return <div>Rezervacija ni možna, prosi administratorja za dostop</div>;

  async function submit() {
    setError(undefined);
    apiFunctions
      .createReservation(event._id, {
        forDate: date?.toISOString() ?? '',
        bands: Array.from(bands),
        modes: Array.from(modes),
      })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        const msg = err.response.data.message;
        if (msg instanceof Array) setError(msg.join(', '));
        else setError(msg);
      });
  }

  const dates = getNextNDays(7, event);

  return (
    <div className="flex flex-col gap-6 rounded border border-gray-500 p-6">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Datum</span>
        </label>
        <input
          ref={dateRef}
          type="date"
          id="date"
          className={`input input-bordered ${date ? 'input-success' : ''}`}
          onChange={(e) => {
            if (!e.target.value) return setDate(undefined);
            const date = new Date(e.target.value + 'Z');
            setDate(date);
          }}
        />
        <div className="mt-3 flex flex-wrap gap-1">
          {dates.map((dt, i) => (
            <button
              key={i}
              onClick={() => {
                setDate(dt);
                dateRef.current!.value = dt.toISOString().slice(0, 10);
              }}
              className={`btn btn-sm flex-1 ${
                date?.valueOf() === dt?.valueOf() ? 'btn-primary' : ''
              }`}
            >
              {getUTCDMString(dt)}
            </button>
          ))}
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Frekvenčna področja</span>
        </label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {Object.values(Band).map((band) => {
            const checked = bands.has(band);
            function toggle() {
              if (!checked) setBands(new Set(bands).add(band));
              else {
                const ns = new Set(bands);
                ns.delete(band);
                setBands(ns);
              }
            }

            return (
              <input
                key={band}
                tabIndex={-1}
                type="checkbox"
                id={band}
                name={band}
                value={band}
                checked={checked}
                onChange={() => toggle()}
                aria-label={band}
                className="btn btn-outline btn-sm"
              />
            );
          })}
        </div>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Načini</span>
        </label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {Object.values(Mode).map((mode) => {
            const checked = modes.has(mode);
            function toggle() {
              if (!checked) setModes(new Set(modes).add(mode));
              else {
                const ns = new Set(modes);
                ns.delete(mode);
                setModes(ns);
              }
            }

            return (
              <input
                key={mode}
                tabIndex={-1}
                type="checkbox"
                id={mode}
                name={mode}
                value={mode}
                checked={checked}
                onChange={() => toggle()}
                aria-label={mode}
                className="btn btn-outline btn-sm"
              />
            );
          })}
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <FontAwesomeIcon icon={faTriangleExclamation} className="h-6 w-6" />
          <span>{error[0].toUpperCase() + error.slice(1)}</span>
        </div>
      )}

      <button className="btn btn-primary" onClick={submit}>
        Rezerviraj
      </button>
    </div>
  );
}
