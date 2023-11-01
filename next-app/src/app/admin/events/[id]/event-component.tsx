'use client';

import { apiFunctions } from '@/api';
import { Loading } from '@/components/loading';
import { PrivateTag } from '@/components/private-tag';
import { ProgressBar } from '@/components/progress-bar';
import { Event } from '@/interfaces/event.interface';
import { User } from '@/interfaces/user.interface';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface EventComponentProps {
  event: Event;
}

export function EventComponent({ event }: EventComponentProps) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex flex-col items-start gap-2">
          <div>
            <h1 className="font-callsign text-4xl font-medium">
              {event.callsign}
            </h1>
            <div className="text-sm opacity-70">{event._id}</div>
          </div>

          <p className="opacity-90">{event.description}</p>
          {event.isPrivate && <PrivateTag />}
        </div>

        {event.fromDateTime && event.toDateTime && (
          <div className="mt-4">
            <div className="mb-2 flex justify-between">
              <div>{event.fromDateTime.toLocaleString()}</div>
              <div>{event.toDateTime.toLocaleString()}</div>
            </div>
            <ProgressBar start={event.fromDateTime} end={event.toDateTime} />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Link href={`/event/${event._id}`} className="btn btn-primary">
          Na stran dogodka
        </Link>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        <AccessComponent event={event} />

        <div>
          <h2 className="mb-4 text-2xl">Rezervacije</h2>
        </div>
      </div>
    </div>
  );
}

function AccessComponent({ event }: EventComponentProps) {
  const [usernameInput, setUsernameInput] = useState('');
  const [users, setUsers] = useState<User[]>();

  useEffect(() => {
    apiFunctions.getManyUsers(event.access).then(setUsers).catch(console.error);
  }, [event.access]);

  async function grantAccess() {
    try {
      const user = await apiFunctions.findByUsername(
        usernameInput.toUpperCase(),
      );
      await apiFunctions.grantEventAccess(event._id, user._id);
      window.location.reload();
      setUsernameInput('');
    } catch (err) {
      console.error(err);
    }
  }

  async function revokeAccess(userId: string) {
    try {
      await apiFunctions.revokeEventAccess(event._id, userId);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2 className="text-2xl">Dostop</h2>

      <div className="my-4 flex items-center gap-2">
        <input
          className="font-callsign input input-bordered flex-1 placeholder:font-normal placeholder:normal-case"
          value={usernameInput}
          placeholder="Dodaj uporabnika"
          onChange={(e) => setUsernameInput(e.target.value)}
        />
        <button className="btn btn-circle btn-primary" onClick={grantAccess}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
        {/* TODO Error */}
      </div>

      {!users ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <colgroup>
              <col width="100%" />
              <col />
            </colgroup>
            <tbody>
              {users?.map((user, i) => (
                <tr key={i}>
                  <td className="font-callsign text-lg">{user.username}</td>
                  <th>
                    <button
                      className="btn btn-circle btn-ghost btn-sm"
                      onClick={() => revokeAccess(user._id)}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
