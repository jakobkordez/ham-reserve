'use client';

import { apiFunctions } from '@/api';
import { PrivateTag } from '@/components/private-tag';
import { ProgressBar } from '@/components/progress-bar';
import { Event } from '@/interfaces/event.interface';
import { User } from '@/interfaces/user.interface';
import { useAuthState } from '@/state/auth-state';
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
        <Link href={`/event/${event._id}`} className="button">
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
  const getAccessToken = useAuthState((state) => state.getAccessToken);

  useEffect(() => {
    getAccessToken().then((token) => {
      if (!token) return;
      apiFunctions.getManyUsers(token, event.access).then((res) => {
        setUsers(res.data);
      });
    });
  }, []);

  async function grantAccess() {
    const token = await getAccessToken();
    if (!token) return;
    const user = await apiFunctions.findByUsername(token, usernameInput);
    if (!user.data) return;
    try {
      await apiFunctions.grantEventAccess(token, event._id, user.data._id);
      window.location.reload();
      setUsernameInput('');
    } catch (err) {
      console.error(err);
    }
  }

  async function revokeAccess(userId: string) {
    const token = await getAccessToken();
    if (!token) return;
    try {
      await apiFunctions.revokeEventAccess(token, event._id, userId);
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
          className="text-input font-callsign flex-1 placeholder:font-normal placeholder:normal-case"
          value={usernameInput}
          placeholder="Dodaj uporabnika"
          onChange={(e) => setUsernameInput(e.target.value)}
        />
        <Button onClick={grantAccess}>
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>

      {users?.map((user, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b py-2 last:border-0"
        >
          <span className="font-callsign px-3 text-lg">{user.username}</span>
          <Button onClick={() => revokeAccess(user._id)}>
            <FontAwesomeIcon icon={faMinus} />
          </Button>
        </div>
      )) ?? <div>Loading...</div>}
    </div>
  );
}

function Button({ children, onClick }: any) {
  return (
    <button
      className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-700"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
