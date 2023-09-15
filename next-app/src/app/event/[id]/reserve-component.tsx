'use client';

import { apiFunctions } from '@/api';
import { Band } from '@/enums/band.enum';
import { Mode } from '@/enums/mode.enum';
import { Event } from '@/interfaces/event.interface';
import { User } from '@/interfaces/user.interface';
import { useAuthState } from '@/state/auth-state';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ReserveComponentProps {
  event: Event;
}

export function ReserveComponent({ event }: ReserveComponentProps) {
  const [user, setUser] = useState<User | null>();
  const [getUser, getAccessToken] = useAuthState((state) => [
    state.getUser,
    state.getAccessToken,
  ]);

  const [date, setDate] = useState<Date>();
  const [bands, setBands] = useState<Band[]>([]);
  const [modes, setModes] = useState<Mode[]>([]);
  const [error, setError] = useState<string>();

  useEffect(() => {
    getUser().then((user) => setUser(user));
  }, [getUser]);

  if (!user)
    return (
      <Link href="/login" className="button">
        Prijavi se za rezervacijo
      </Link>
    );

  if (!event.access.includes(user._id))
    return <div>Rezervacija ni možna, prosi administratorja za dostop</div>;

  async function submit() {
    setError(undefined);
    const token = await getAccessToken();
    if (!token) return;
    apiFunctions
      .createReservation(token, event._id, {
        forDate: date!.toISOString(),
        bands,
        modes,
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

  return (
    <div className="flex flex-col gap-4 rounded border border-gray-500 p-6">
      <div className="flex flex-col gap-1">
        <label htmlFor="date">Datum</label>
        <input
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
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="bands">Frekvenčna področja</label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {Object.values(Band).map((band) => (
            <div
              key={band}
              className="flex gap-2 rounded-md bg-gray-600 px-4 py-2"
            >
              <input
                type="checkbox"
                id={band}
                name={band}
                value={band}
                checked={bands.includes(band)}
                onChange={(e) => {
                  if (e.target.checked) setBands([...bands, band]);
                  else setBands(bands.filter((b) => b !== band));
                }}
              />
              <label htmlFor={band}>{band}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="modes">Načini</label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {Object.values(Mode).map((mode) => (
            <div
              key={mode}
              className="flex gap-2 rounded-md bg-gray-600 px-4 py-2"
            >
              <input
                type="checkbox"
                id={mode}
                name={mode}
                value={mode}
                checked={modes.includes(mode)}
                onChange={(e) => {
                  if (e.target.checked) setModes([...modes, mode]);
                  else setModes(modes.filter((m) => m !== mode));
                }}
              />
              <label htmlFor={mode}>{mode}</label>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex flex-row items-center gap-4 rounded border border-red-500 bg-red-500/10 p-4 text-red-600">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            className="h-6 w-6 text-red-500"
          />
          <span>{error[0].toUpperCase() + error.slice(1)}</span>
        </div>
      )}

      <button className="button" onClick={submit}>
        Rezerviraj
      </button>
    </div>
  );
}
