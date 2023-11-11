'use client';

import { apiFunctions } from '@/api';
import { useAuthState } from '@/state/auth-state';
import { uppercaseInput } from '@/util/input.util';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface LoginProps {
  searchParams: {
    redirect?: string;
  };
}

export default function Login({ searchParams: { redirect } }: LoginProps) {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();

  const isValid = useAuthState((s) => s.isValid);

  useEffect(() => {
    isValid().then((r) => {
      if (r) window.location.replace('/');
    });
  }, [isValid]);

  function login() {
    setError(undefined);

    apiFunctions
      .login(username, password)
      .then((res) => {
        useAuthState.setState(res);
        // window.location.replace(redirect || '/');
        router.replace(redirect || '/');
      })
      .catch((e) => {
        console.error(e);
        setError('Napačno uporabniško ime ali geslo');
      });
  }

  return (
    <div className="container py-10">
      <form
        className="mx-auto flex max-w-2xl flex-col gap-4 rounded-xl bg-gray-100 p-10 shadow-lg dark:bg-gray-800"
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
      >
        <h1 className="text-2xl font-bold">Prijava</h1>

        <div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Uporabniško ime</span>
            </label>
            <input
              id="username"
              type="username"
              className="input input-bordered"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onInput={uppercaseInput}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Geslo</span>
            </label>
            <input
              id="password"
              type="password"
              className="input input-bordered"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <button className="btn btn-primary">Prijava</button>
      </form>
    </div>
  );
}
