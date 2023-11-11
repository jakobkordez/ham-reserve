'use client';

import { apiFunctions } from '@/api';
import { Loading } from '@/components/loading';
import { PrivateTag } from '@/components/private-tag';
import { ProgressBar } from '@/components/progress-bar';
import { Event } from '@/interfaces/event.interface';
import { Reservation } from '@/interfaces/reservation.interface';
import { User } from '@/interfaces/user.interface';
import { getUTCString } from '@/util/date.util';
import {
  faFileCircleCheck,
  faFileCircleExclamation,
  faMinus,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
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
              <div>{getUTCString(event.fromDateTime)}</div>
              <div>{getUTCString(event.toDateTime)}</div>
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

        <ReservationsComponent event={event} />
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

function ReservationsComponent({ event }: EventComponentProps) {
  const [reservations, setReservations] = useState<Reservation[]>();
  const [users, setUsers] = useState<Map<string, User>>();

  useEffect(() => {
    apiFunctions
      .getReservationsForEvent(event._id)
      .then((res) => {
        setReservations(
          res.sort(
            (a, b) => b.startDateTime.valueOf() - a.startDateTime.valueOf(),
          ),
        );
        const u = new Set<string>(res.map((r) => r.user));
        apiFunctions
          .getManyUsers(Array.from(u))
          .then((users) => {
            setUsers(new Map(users.map((u) => [u._id, u])));
          })
          .catch(console.error);
      })
      .catch(console.error);
  }, [event._id]);

  return (
    <div>
      <h2 className="text-2xl">Rezervacije</h2>

      <div className="overflow-x-auto">
        <table className="table">
          <colgroup>
            <col width="50%" />
            <col width="50%" />
            <col />
            <col />
          </colgroup>
          <tbody>
            {reservations?.map((reservation, i) => (
              <tr key={i}>
                <td className="font-callsign text-lg">
                  {users?.get(reservation.user)?.username ?? (
                    <span className="loading loading-sm" />
                  )}
                </td>
                <td>
                  {getUTCString(reservation.startDateTime)} -{' '}
                  {getUTCString(reservation.endDateTime)}
                </td>
                <td>
                  {reservation.startDateTime < new Date() && (
                    <FontAwesomeIcon
                      icon={
                        reservation.logSummary
                          ? faFileCircleCheck
                          : faFileCircleExclamation
                      }
                      className={`h-5 w-5 ${
                        reservation.logSummary
                          ? 'text-green-400'
                          : 'text-orange-300'
                      }`}
                    />
                  )}
                </td>
                <td>
                  <Link
                    href={`/reservation/${reservation._id}`}
                    className="btn btn-sm"
                  >
                    Več
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
