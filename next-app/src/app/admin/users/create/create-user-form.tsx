'use client';

import { apiFunctions } from '@/api';
import {
  faShuffle,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CreateUserForm() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(generateRandom(8));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string>();

  function submit() {
    setError(undefined);
    apiFunctions
      .createUser({
        username: username.toUpperCase(),
        password,
        name,
        email: email || undefined,
        phone: phone || undefined,
      })
      .then(() => {
        router.push('/admin/users');
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
          <span className="label-text">Uporabniško ime (klicni znak)</span>
        </label>
        <input
          type="text"
          id="username"
          className="font-callsign input input-bordered"
          placeholder="S50HQ"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Geslo</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="password"
            className="input input-bordered flex-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => setPassword(generateRandom(8))}
          >
            <FontAwesomeIcon icon={faShuffle} width={30} height={30} />
            Naključno
          </button>
        </div>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Ime</span>
        </label>
        <input
          type="text"
          id="name"
          className="input input-bordered"
          placeholder="Ime in priimek"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          id="email"
          className="input input-bordered"
          placeholder="s50hq@hamradio.si"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Telefon</span>
        </label>
        <input
          type="tel"
          id="phone"
          className="input input-bordered"
          placeholder="+386 40 555 555"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
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

function generateRandom(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}
