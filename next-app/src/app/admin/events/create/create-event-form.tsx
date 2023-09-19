'use client';

import { apiFunctions } from '@/api';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CreateEventForm() {
  const [callsign, setCallsign] = useState('');
  const [description, setDescription] = useState('');
  const [fromDateTime, setFromDateTime] = useState<Date>();
  const [toDateTime, setToDateTime] = useState<Date>();
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState<string>();

  const router = useRouter();

  function submit() {
    setError(undefined);
    apiFunctions
      .createEvent({
        callsign: callsign.toUpperCase(),
        description,
        fromDateTime: fromDateTime?.toISOString(),
        toDateTime: toDateTime?.toISOString(),
        isPrivate,
      })
      .then(() => {
        router.push('/admin/events');
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
        <label htmlFor="callsign">Klicni znak</label>
        <input
          type="text"
          id="callsign"
          className="text-input font-callsign"
          placeholder="S50HQ"
          value={callsign}
          onChange={(e) => setCallsign(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="description">Opis</label>
        <textarea
          id="description"
          className="text-input"
          placeholder="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="fromDateTime">Od</label>
          <input
            type="datetime-local"
            id="fromDateTime"
            className={`text-input ${
              fromDateTime ? 'border-green-600 outline-green-600' : ''
            }`}
            onChange={(e) => {
              if (!e.target.value) return setFromDateTime(undefined);
              const date = new Date(e.target.value + 'Z');
              setFromDateTime(date);
            }}
          />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <label htmlFor="toDateTime">Do</label>
          <input
            type="datetime-local"
            id="toDateTime"
            className={`text-input ${
              toDateTime
                ? 'border-green-600 focus-visible:outline-green-600'
                : ''
            }`}
            onChange={(e) => {
              if (!e.target.value) return setToDateTime(undefined);
              const date = new Date(e.target.value + 'Z');
              setToDateTime(date);
            }}
          />
        </div>
      </div>
      <div className="flex items-center gap-4 text-lg">
        <input
          type="checkbox"
          id="isPrivate"
          className="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
        <label htmlFor="isPrivate">Zasebno</label>
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
        Ustvari
      </button>
    </div>
  );
}
