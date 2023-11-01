'use client';

import { apiFunctions } from '@/api';
import { Event } from '@/interfaces/event.interface';
import { LogSummary } from '@/interfaces/log-summary.interface';
import { Reservation } from '@/interfaces/reservation.interface';
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
      <div className="flex flex-col gap-4">
        <h1 className="font-callsign text-3xl">{event.callsign}</h1>

        <div className="flex flex-col gap-1">
          <div>Datum: {reservation.forDate.toISOString().slice(0, 10)}</div>
          <div>Frekvenčni pasovi: {reservation.bands.join(', ')}</div>
          <div>Način dela: {reservation.modes.join(', ')}</div>
        </div>
      </div>

      {reservation.forDate < new Date() && (
        <div className="flex flex-col gap-6">
          <div className="text-2xl">Radioamaterski dnevnik rezervacije</div>

          <div
            className={`alert ${
              reservation.logSummary ? 'alert-success' : 'alert-warning'
            }`}
          >
            <FontAwesomeIcon
              icon={
                reservation.logSummary
                  ? faFileCircleCheck
                  : faFileCircleExclamation
              }
              width={32}
              height={32}
              className="h-8 w-8 shrink-0"
            />
            <span>
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

      <table className="table table-sm">
        <tbody>
          <tr>
            <td>Število zvez</td>
            <td>{logSummary.qso_count}</td>
          </tr>
          <tr>
            <td>Frekvenčni pasovi</td>
            <td>{logSummary.bands.join(', ').toLocaleLowerCase()}</td>
          </tr>
          <tr>
            <td>Načini dela</td>
            <td>{logSummary.modes.join(', ')}</td>
          </tr>
          <tr>
            <td>Čas dela</td>
            <td>
              {getUTCString(logSummary.first_qso_time)} &rarr;{' '}
              {getUTCString(logSummary.last_qso_time)}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="text-orange-500 dark:text-warning">
        {(logSummary.warnings?.length ?? 0) > 0 && (
          <div className="mt-3">Opozorila:</div>
        )}
        {logSummary.warnings?.map((warning, i) => <div key={i}>{warning}</div>)}
      </div>
    </div>
  );
}

function Upload({ res }: { res: Reservation }) {
  const [error, setError] = useState<string>();
  const [file, setFile] = useState<File>();

  async function submit() {
    if (!file) {
      setError('Datoteka ni izbrana');
      console.error('No file selected');
      return;
    }

    apiFunctions
      .uploadLog(res._id, file)
      .then(() => {
        window.location.reload();
      })
      .catch((e) => {
        setError(e.response.data.message);
        console.error(e);
      });
  }

  return (
    <div className="form-control">
      <label className="label">
        {res.logSummary ? 'Ponovno o' : 'O'}ddaj dnevnik
      </label>
      <div className="flex items-center gap-3">
        <input
          type="file"
          className="file-input file-input-bordered"
          onChange={(e) =>
            setFile(e.target.files ? e.target.files[0] : undefined)
          }
        />
        <button className="btn btn-primary" onClick={() => submit()}>
          {res.logSummary ? 'Povozi' : 'Pošlji'}
        </button>
      </div>
      {error && <div className="text-error">{error}</div>}
    </div>
  );
}
