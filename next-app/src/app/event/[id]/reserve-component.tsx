'use client';

import { apiFunctions } from '@/api';
import { Band } from '@/enums/band.enum';
import { Mode } from '@/enums/mode.enum';
import { Event } from '@/interfaces/event.interface';
import { User } from '@/interfaces/user.interface';
import { useUserState } from '@/state/user-state';
import { dayInMs, getUTCString, hourInMs } from '@/util/date.util';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

interface ReserveComponentProps {
  event: Event;
}

function floorHour(date: number) {
  return new Date(Math.floor(date / hourInMs) * hourInMs);
}

function padZero(num: number) {
  return num.toString().padStart(2, '0');
}

export function ReserveComponent({ event }: ReserveComponentProps) {
  const [user, setUser] = useState<User | null>();
  const getUser = useUserState((state) => state.getUser);

  const [startDT, setStartDT] = useState<Date>(floorHour(Date.now()));
  const [endDT, setEndDT] = useState<Date>(floorHour(Date.now() + hourInMs));
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
        bands: Array.from(bands),
        modes: Array.from(modes),
        startDateTime: startDT.toISOString(),
        endDateTime: endDT.toISOString(),
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

  // const dates = getNextNDays(7, event);

  return (
    <div className="flex flex-col gap-6 rounded-lg border p-6">
      {/* <div className="tabs-boxed tabs">
        <a className="tab flex-1">Rezerviraj po urah</a>
        <a className="tab tab-active flex-1">Rezerviraj po dnevih</a>
      </div> */}

      <div className="grid gap-4 md:grid-cols-2">
        <DateTimeInput label="Začetek" value={startDT} onChange={setStartDT} />

        <DateTimeInput label="Konec" value={endDT} onChange={setEndDT} />
      </div>

      {startDT.valueOf() == endDT.valueOf() && (
        <div className="alert alert-error">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            height={24}
            width={24}
            className="h-6 w-6"
          />
          Rezervacija mora biti dolga vsaj eno uro
        </div>
      )}

      {startDT.valueOf() > endDT.valueOf() && (
        <div className="alert alert-error">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            height={24}
            width={24}
            className="h-6 w-6"
          />
          Začetek mora biti pred koncem
        </div>
      )}

      {endDT.valueOf() - startDT.valueOf() > dayInMs && (
        <div className="alert alert-warning">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
            height={24}
            width={24}
            className="h-6 w-6"
          />
          Delaš rezervacijo daljšo od enega dneva, upoštevaj tudi ostale
        </div>
      )}

      {/* <div className="mt-3 flex flex-wrap gap-1">
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
          </div> */}

      <div className="form-control">
        <label className="label">
          <span className="label-text font-bold">Frekvenčna področja</span>
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
          <span className="label-text font-bold">Načini</span>
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

interface DateTimeInputProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

function DateTimeInput({ label, value, onChange }: DateTimeInputProps) {
  function toISO(date: Date) {
    const v = date.toISOString().split('T')[0];
    if (v.startsWith('+')) return v.slice(1);
    return v;
  }

  return (
    <div className="form-control rounded-lg border border-gray-200 px-5 py-3">
      <label className="label">
        <span className="label-text font-bold">{label} (UTC)</span>
      </label>
      <div className="flex gap-2">
        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text">Datum</span>
          </label>
          <input
            type="date"
            className="input input-bordered"
            value={toISO(value)}
            onChange={(e) => {
              const val = e.target.valueAsDate;
              if (!val) return;
              onChange(val);
            }}
          />
        </div>
        <div className="form-control w-1/3">
          <label className="label">
            <span className="label-text">Ura</span>
          </label>
          <input
            type="number"
            className="input input-bordered"
            min={0}
            max={23}
            value={padZero(value.getUTCHours())}
            onChange={(e) => {
              if (!e.target.value) return;
              const date = new Date(value);
              let nv = parseInt(e.target.value);
              if (nv > 23) nv %= 100;
              if (nv > 23) nv %= 10;
              date.setUTCHours(nv);
              onChange(date);
            }}
          />
        </div>
      </div>
      <div className="mt-2 text-center">{getUTCString(value)}</div>
    </div>
  );
}
