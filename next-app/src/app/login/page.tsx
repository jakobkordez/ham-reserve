'use client';

import { apiFunctions } from '@/api';
import { useAuthState } from '@/state/auth-state';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isValid = useAuthState((s) => s.isValid);
  const router = useRouter();

  useEffect(() => {
    isValid().then((r) => {
      if (r) router.replace('/');
    });
  }, []);

  return (
    <div className="mx-auto my-10 flex max-w-2xl flex-col gap-4 rounded-xl bg-gray-100 p-10 dark:bg-[#454545]">
      <h1 className="text-2xl font-bold">Prijava</h1>
      <div className="flex flex-col gap-1">
        <label htmlFor="username">Uporabniško ime</label>
        <input
          id="username"
          type="username"
          className="text-input"
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
      <button className="button" onClick={() => login(username, password)}>
        Prijava
      </button>
    </div>
  );
}

const login = async (username: string, password: string) => {
  try {
    const res = (await apiFunctions.login(username, password)).data;
    useAuthState.setState(res);
    window.location.href = '/';
  } catch (e) {
    console.log(e);
  }
};
