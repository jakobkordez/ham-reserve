'use client';

import { apiFunctions } from '@/api';
import { Band, COMMON_BANDS } from '@/enums/band.enum';
import { COMMON_MODES, Mode } from '@/enums/mode.enum';
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

function formatHours(start: Date, end: Date) {
  const hours = (end.valueOf() - start.valueOf()) / hourInMs;
  switch (hours) {
    case 1:
      return '1 ura';
    case 2:
      return '2 uri';
    case 3:
    case 4:
      return hours + ' ure';
    default:
      return hours + ' ur';
  }
}

export function ReserveComponent({ event }: ReserveComponentProps) {
  const [user, setUser] = useState<User | null>();
  const getUser = useUserState((state) => state.getUser);

  const [availableBands, setAvailableBands] = useState<Set<Band>>(
    new Set(COMMON_BANDS),
  );
  const [availableModes, setAvailableModes] = useState<Set<Mode>>(
    new Set(COMMON_MODES),
  );

  const [startDT, setStartDT] = useState<Date>(floorHour(Date.now()));
  const [endDT, setEndDT] = useState<Date>(floorHour(Date.now() + hourInMs));
  const [bands, setBands] = useState<Set<Band>>(new Set());
  const [modes, setModes] = useState<Set<Mode>>(new Set());
  const [error, setError] = useState<string>();

  const allValid =
    startDT.valueOf() < endDT.valueOf() && bands.size > 0 && modes.size > 0;

  const [modalOpen, setModalOpen] = useState(false);

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
        setModalOpen(false);
      });
  }

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

      <div className="form-control">
        <label className="label">
          <span className="label-text font-bold">Frekvenčna področja</span>
        </label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {Array.from(availableBands).map((band) => {
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
                className="btn btn-sm"
              />
            );
          })}

          <select
            className="select select-sm bg-base-200 text-center font-bold uppercase md:px-3"
            value=""
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return;
              setBands(new Set(bands).add(val as Band));
              setAvailableBands(new Set(availableBands).add(val as Band));
            }}
          >
            <option value="">Ostala</option>
            {Object.values(Band).map((band) => (
              <option key={band}>{band}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text font-bold">Načini</span>
        </label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {Array.from(availableModes).map((mode) => {
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
                className="btn btn-sm"
              />
            );
          })}

          <select
            className="select select-sm bg-base-200 text-center font-bold uppercase md:px-3"
            value=""
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return;
              setModes(new Set(modes).add(val as Mode));
              setAvailableModes(new Set(availableModes).add(val as Mode));
            }}
          >
            <option value="">Ostali</option>
            {Object.values(Mode).map((mode) => (
              <option key={mode}>{mode}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <FontAwesomeIcon icon={faTriangleExclamation} className="h-6 w-6" />
          <span>{error[0].toUpperCase() + error.slice(1)}</span>
        </div>
      )}

      <button
        className="btn btn-primary"
        onClick={() => setModalOpen(true)}
        disabled={!allValid}
      >
        Rezerviraj
      </button>

      <div className={`modal ${modalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="text-lg font-bold">Potrdi rezervacijo</h3>
          <p className="py-4">
            Previdno preglej podatke in potrdi rezervacijo.
          </p>

          <table className="table">
            <tbody>
              <tr>
                <th>Klicni znak:</th>
                <td>{event.callsign}</td>
              </tr>
              <tr>
                <th>Začetek:</th>
                <td>{getUTCString(startDT)}</td>
              </tr>
              <tr>
                <th>Konec:</th>
                <td>{getUTCString(endDT)}</td>
              </tr>
              <tr>
                <th>Čas:</th>
                <td>{formatHours(startDT, endDT)}</td>
              </tr>
              <tr>
                <th>Frekvenčna področja:</th>
                <td>{Array.from(bands).join(', ')}</td>
              </tr>
              <tr>
                <th>Načini:</th>
                <td>{Array.from(modes).join(', ')}</td>
              </tr>
            </tbody>
          </table>

          <div className="modal-action">
            <form method="dialog">
              <button className="btn" onClick={() => setModalOpen(false)}>
                Prekliči
              </button>
            </form>
            <form method="dialog">
              <button className="btn btn-primary" onClick={submit}>
                Potrdi
              </button>
            </form>
          </div>
        </div>
      </div>
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
