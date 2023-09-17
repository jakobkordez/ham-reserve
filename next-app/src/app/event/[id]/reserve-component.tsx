'use client';

import { apiFunctions } from '@/api';
import { Band } from '@/enums/band.enum';
import { Mode } from '@/enums/mode.enum';
import { Event } from '@/interfaces/event.interface';
import { User } from '@/interfaces/user.interface';
import { useAuthState } from '@/state/auth-state';
import { dayInMs } from '@/util/date.util';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

interface ReserveComponentProps {
  event: Event;
}

export function ReserveComponent({ event }: ReserveComponentProps) {
  const dateRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>();
  const [getUser, getAccessToken] = useAuthState((state) => [
    state.getUser,
    state.getAccessToken,
  ]);

  const [date, setDate] = useState<Date>();
  const [bands, setBands] = useState<Set<Band>>(new Set());
  const [modes, setModes] = useState<Set<Mode>>(new Set());
  const [error, setError] = useState<string>();

  useEffect(() => {
    getUser().then((user) => setUser(user));
  }, [getUser]);

  if (!user) return <></>;

  if (!event.access.includes(user._id))
    return <div>Rezervacija ni možna, prosi administratorja za dostop</div>;

  async function submit() {
    setError(undefined);
    const token = await getAccessToken();
    if (!token) return;
    apiFunctions
      .createReservation(token, event._id, {
        forDate: date!.toISOString(),
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

  const dates = new Array(7)
    .fill(null)
    .map((_, i) => new Date(Math.floor(Date.now() / dayInMs + i) * dayInMs))
    .filter(
      (date) =>
        (!event.fromDateTime || date >= event.fromDateTime) &&
        (!event.toDateTime || date <= event.toDateTime),
    );

  return (
    <div className="flex flex-col gap-6 rounded border border-gray-500 p-6">
      <div className="flex flex-col gap-1">
        <label htmlFor="date">Datum</label>
        <input
          ref={dateRef}
          type="date"
          id="date"
          className={`text-input ${
            date ? 'border-green-600 focus-visible:outline-green-600' : ''
          }`}
          onChange={(e) => {
            if (!e.target.value) return setDate(undefined);
            const date = new Date(e.target.value + 'Z');
            setDate(date);
          }}
        />
        <div className="flex flex-wrap gap-1">
          {dates.map((dt, i) => (
            <button
              key={i}
              className={`button flex-1 shadow ${
                date?.valueOf() === dt?.valueOf() ? 'is-green' : 'is-light'
              }`}
              onClick={() => {
                setDate(dt);
                dateRef.current!.value = dt.toISOString().slice(0, 10);
              }}
            >
              {dt.getDate()}/{dt.getMonth() + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="bands">Frekvenčna področja</label>
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
              <button
                key={band}
                className={`button button flex items-center gap-2 shadow ${
                  checked ? 'is-green' : 'is-light'
                }`}
                onClick={toggle}
              >
                <input
                  tabIndex={-1}
                  type="checkbox"
                  id={band}
                  name={band}
                  value={band}
                  checked={checked}
                  onChange={() => toggle()}
                />
                <span>{band}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="modes">Načini</label>
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
              <button
                key={mode}
                className={`button flex items-center gap-2 shadow ${
                  checked ? 'is-green' : 'is-light'
                }`}
                onClick={toggle}
              >
                <input
                  tabIndex={-1}
                  type="checkbox"
                  id={mode}
                  name={mode}
                  value={mode}
                  checked={checked}
                  onChange={() => toggle()}
                />
                <span>{mode}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-4 rounded border border-red-500 bg-red-500/10 p-4 text-red-600">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="h-6 w-6 text-red-500"
          />
          <span>{error[0].toUpperCase() + error.slice(1)}</span>
        </div>
      )}

      <button className="button is-primary" onClick={submit}>
        Rezerviraj
      </button>
    </div>
  );
}
