'use client';

import { apiFunctions } from '@/api';
import { Event } from '@/interfaces/event.interface';
import { LogSummary } from '@/interfaces/log-summary.interface';
import { Reservation } from '@/interfaces/reservation.interface';
import { useAuthState } from '@/state/auth-state';
import { getUTCString } from '@/util/date.util';
import {
  faFileCircleCheck,
  faFileCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

interface ReservationComponentProps {
  reservation: Reservation;
  event: Event;
}

export function ReservationComponent({
  reservation,
  event,
}: ReservationComponentProps) {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-callsign text-3xl">{event.callsign}</h1>

      <div className="flex flex-col gap-1">
        <div className="text-lg">
          Datum: {reservation.forDate.toISOString().slice(0, 10)}
        </div>
        <div className="flex flex-wrap items-center gap-1 text-lg">
          <span className="mr-1">Frekvenčni pasovi:</span>
          {reservation.bands.map((band) => (
            <span key={band} className="tag shadow">
              {band}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1 text-lg">
          <span className="mr-1">Način dela:</span>
          {reservation.modes.map((mode) => (
            <span key={mode} className="tag shadow">
              {mode}
            </span>
          ))}
        </div>
      </div>

      {reservation.forDate < new Date() && (
        <div className="flex flex-col gap-6">
          <div className="text-2xl">Radioamaterski dnevnik rezervacije</div>

          <div className="flex items-center gap-4">
            <FontAwesomeIcon
              icon={
                reservation.logSummary
                  ? faFileCircleCheck
                  : faFileCircleExclamation
              }
              className={`text-3xl ${
                reservation.logSummary ? 'text-green-500' : 'text-yellow-200'
              }`}
            />
            <span className="text-lg">
              Dnevnik {reservation.logSummary ? 'uspešno' : 'še ni'} oddan
            </span>
          </div>

          {reservation.logSummary && (
            <LogSummaryC logSummary={reservation.logSummary} />
          )}

          <Upload res={reservation} />
        </div>
      )}
    </div>
  );
}

function LogSummaryC({ logSummary }: { logSummary: LogSummary }) {
  return (
    <div className="max-h-72 overflow-y-auto rounded-lg bg-gray-100 p-5 dark:bg-gray-800">
      <div className="mb-3 text-xl font-medium">Poročilo oddanega dnevnika</div>

      <div className="table">
        <div className="table-row">
          <div className="table-cell pr-4">Število zvez</div>
          <div className="table-cell">{logSummary.qso_count}</div>
        </div>
        <div className="table-row">
          <div className="table-cell pr-4">Frekvenčni pasovi</div>
          <div className="table-cell">
            {logSummary.bands.join(', ').toLocaleLowerCase()}
          </div>
        </div>
        <div className="table-row">
          <div className="table-cell pr-4">Načini dela</div>
          <div className="table-cell">{logSummary.modes.join(', ')}</div>
        </div>
        <div className="table-row">
          <div className="table-cell pr-4">Čas dela</div>
          <div className="table-cell">
            {getUTCString(logSummary.first_qso_time)} &rarr;{' '}
            {getUTCString(logSummary.last_qso_time)}
          </div>
        </div>
      </div>

      <div className="text-orange-500 dark:text-yellow-100">
        {logSummary.warnings && <div className="mt-3">Opozorila:</div>}
        {logSummary.warnings?.map((warning, i) => <div key={i}>{warning}</div>)}
      </div>
    </div>
  );
}

function Upload({ res }: { res: Reservation }) {
  const [file, setFile] = useState<File>();
  const getAccessToken = useAuthState((state) => state.getAccessToken);

  async function submit() {
    if (!file) {
      console.error('No file selected');
      return;
    }

    const token = await getAccessToken();
    if (!token) {
      console.error('No token');
      return;
    }

    apiFunctions
      .uploadLog(token, res._id, file)
      .then(() => {
        window.location.reload();
      })
      .catch(console.error);
  }

  return (
    <div>
      <div className="mb-1">
        {res.logSummary ? 'Ponovno o' : 'O'}ddaj dnevnik
      </div>
      <div className="flex items-center gap-5">
        <input
          type="file"
          className="text-input"
          onChange={(e) =>
            setFile(e.target.files ? e.target.files[0] : undefined)
          }
        />
        <button className="button is-primary" onClick={() => submit()}>
          {res.logSummary ? 'Povozi' : 'Pošlji'}
        </button>
      </div>
    </div>
  );
}
