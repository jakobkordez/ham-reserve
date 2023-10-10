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
    <div className="flex flex-col gap-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Klicni znak</span>
        </label>
        <input
          type="text"
          id="callsign"
          className="font-callsign input input-bordered"
          placeholder="S50HQ"
          value={callsign}
          onChange={(e) => setCallsign(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Opis</span>
        </label>
        <textarea
          id="description"
          className="textarea textarea-bordered"
          placeholder="Opis"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text">Od</span>
          </label>
          <input
            type="datetime-local"
            id="fromDateTime"
            className={`input input-bordered ${
              fromDateTime ? 'input-success' : ''
            }`}
            onChange={(e) => {
              if (!e.target.value) return setFromDateTime(undefined);
              const date = new Date(e.target.value + 'Z');
              setFromDateTime(date);
            }}
          />
        </div>
        <div className="form-control flex-1">
          <label className="label">
            <span className="label-text">Do</span>
          </label>
          <input
            type="datetime-local"
            id="toDateTime"
            className={`input input-bordered ${
              toDateTime ? 'input-success' : ''
            }`}
            onChange={(e) => {
              if (!e.target.value) return setToDateTime(undefined);
              const date = new Date(e.target.value + 'Z');
              setToDateTime(date);
            }}
          />
        </div>
      </div>

      <div className="form-control w-32">
        <label className="label cursor-pointer">
          <span className="label-text">Zasebno</span>
          <input
            type="checkbox"
            className="checkbox"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
        </label>
      </div>

      {error && (
        <div className="alert alert-error">
          <FontAwesomeIcon icon={faTriangleExclamation} className="h-6 w-6" />
          <span>{error[0].toUpperCase() + error.slice(1)}</span>
        </div>
      )}

      <button className="btn btn-primary" onClick={submit}>
        Ustvari
      </button>
    </div>
  );
}
