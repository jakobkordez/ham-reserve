'use client';

import { apiFunctions } from '@/api';
import { User } from '@/interfaces/user.interface';
import { useUserState } from '@/state/user-state';
import {
  faCircleCheck,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

export default function EditProfile() {
  const [user, setUser] = useState<User>();
  const getUser = useUserState((s) => s.getUser);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState<string>('');
  const [passChanged, setPassChanged] = useState<boolean>(false);
  const [passChangeError, setPassChangeError] = useState<string>();

  useEffect(() => {
    getUser(true).then((u) => {
      setUser(u || undefined);
      setName(u?.name ?? '');
      setEmail(u?.email ?? '');
      setPhone(u?.phone ?? '');
    });
  }, [getUser]);

  function save() {
    setSaved(false);

    if (name === user?.name && email === user?.email && phone === user?.phone) {
      setSaved(true);
      return;
    }

    apiFunctions
      .updateSelf({
        name: name !== (user?.name ?? '') ? name : undefined,
        email: email !== (user?.email ?? '') ? email : undefined,
        phone: phone !== (user?.phone ?? '') ? phone : undefined,
      })
      .then((u) => {
        setUser(u);
        setName(u?.name);
        setEmail(u?.email);
        setPhone(u?.phone);
        setSaved(true);
        getUser(true);
      });
  }

  function changePassword() {
    setPassChangeError(undefined);
    setPassChanged(false);

    if (newPassword !== newPasswordRepeat) {
      setPassChangeError('Ponovitev novega gesla se ne ujema');
      return;
    }

    apiFunctions
      .updateSelfPassword(oldPassword, newPassword)
      .then(() => {
        setPassChanged(true);
        getUser(true);
      })
      .catch((e) => setPassChangeError(e.message));
  }

  return (
    <div className="container flex flex-col items-center justify-center gap-10 py-10 lg:flex-row lg:items-start">
      <div className="flex w-full max-w-xl flex-col gap-4 rounded-lg bg-gray-200 p-10 dark:bg-gray-800">
        <h1 className="text-4xl font-bold">Uredi profil</h1>

        <div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Uporabniško ime</span>
            </label>
            <input
              type="text"
              value={user?.username ?? ''}
              disabled
              className="input input-bordered"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Ime in priimek</span>
            </label>
            <input
              type="text"
              className={`input input-bordered ${
                name !== (user?.name ?? '') && 'input-info'
              }`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">E-pošta</span>
              <span className="label-text-alt">Neobvezno</span>
            </label>
            <input
              type="email"
              className={`input input-bordered ${
                email !== (user?.email ?? '') && 'input-info'
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Telefonska številka</span>
              <span className="label-text-alt">Neobvezno</span>
            </label>
            <input
              type="tel"
              className={`input input-bordered ${
                phone !== (user?.phone ?? '') && 'input-info'
              }`}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {saved && (
          <div className="alert alert-success">
            <FontAwesomeIcon
              icon={faCircleCheck}
              width={24}
              height={24}
              className="shrink-0"
            />
            <span>Spremembe so bile shranjene</span>
          </div>
        )}

        <button className="btn btn-primary" onClick={save}>
          Shrani
        </button>
      </div>

      <div className="flex w-full max-w-xl flex-col gap-4 rounded-lg bg-gray-200 p-10 dark:bg-gray-800">
        <h2 className="text-4xl font-bold">Spremeni geslo</h2>

        <div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Trenutno geslo</span>
            </label>
            <input
              type="password"
              className="input input-bordered"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Novo geslo</span>
            </label>
            <input
              type="password"
              className="input input-bordered"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Ponovi geslo</span>
            </label>
            <input
              type="password"
              className="input input-bordered"
              value={newPasswordRepeat}
              onChange={(e) => setNewPasswordRepeat(e.target.value)}
            />
          </div>
        </div>

        {passChangeError && (
          <div className="alert alert-error">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              width={24}
              height={24}
              className="shrink-0"
            />
            <span>{passChangeError}</span>
          </div>
        )}

        {passChanged && (
          <div className="alert alert-success">
            <FontAwesomeIcon
              icon={faCircleCheck}
              width={24}
              height={24}
              className="shrink-0"
            />
            <span>Geslo uspešno spremenjeno</span>
          </div>
        )}

        <button className="btn btn-primary" onClick={changePassword}>
          Spremeni geslo
        </button>
      </div>
    </div>
  );
}
