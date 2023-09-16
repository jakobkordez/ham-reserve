'use client';

import { apiFunctions } from '@/api';
import { useAuthState } from '@/state/auth-state';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CreateUserForm() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string>();

  const getAccessToken = useAuthState((s) => s.getAccessToken);

  function submit() {
    setError(undefined);
    getAccessToken().then((accessToken) => {
      if (!accessToken) {
        setError('Session expired');
        throw new Error('No access token');
      }
      apiFunctions
        .createUser(accessToken, {
          username: username.toUpperCase(),
          password,
          name,
          email: email || undefined,
          phone: phone || undefined,
        })
        .then((res) => {
          console.log(res);
          router.push('/admin/users');
        })
        .catch((err) => {
          console.error(err);
          const msg = err.response.data.message;
          if (msg instanceof Array) setError(msg.join(', '));
          else setError(msg);
        });
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded border border-gray-500 p-6">
      <div className="flex flex-col gap-1">
        <label htmlFor="username">Uporabniško ime (klicni znak)</label>
        <input
          type="text"
          id="username"
          className="text-input font-callsign"
          placeholder="S50HQ"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password">Geslo</label>
        <input
          type="password"
          id="password"
          className="text-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="name">Ime</label>
        <input
          type="text"
          id="name"
          className="text-input"
          placeholder="Ime in priimek"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="text-input"
          placeholder="s50hq@hamradio.si"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="phone">Telefon</label>
        <input
          type="tel"
          id="phone"
          className="text-input"
          placeholder="+386 40 555 555"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
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

      <button className="button" onClick={submit}>
        Ustvari
      </button>
    </div>
  );
}
