'use client';

import { apiFunctions } from '@/api';
import { useAuthState } from '@/state/auth-state';
import { useEffect, useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isValid = useAuthState((s) => s.isValid);

  useEffect(() => {
    isValid().then((r) => {
      if (r) window.location.replace('/');
    });
  }, [isValid]);

  async function login() {
    try {
      const res = await apiFunctions.login(username.toUpperCase(), password);
      useAuthState.setState(res.data);
      window.location.replace('/');
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="container py-10">
      <div className="mx-auto flex max-w-2xl flex-col gap-4 rounded-xl bg-gray-100 p-10 shadow-lg dark:bg-gray-800">
        <h1 className="text-2xl font-bold">Prijava</h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="username">Uporabniško ime</label>
          <input
            id="username"
            type="username"
            className="text-input font-callsign"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Geslo</label>
          <input
            id="password"
            type="password"
            className="text-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="button" onClick={() => login()}>
          Prijava
        </button>
      </div>
    </div>
  );
}
