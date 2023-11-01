import { FormEvent } from 'react';

export function uppercaseInput(e: FormEvent<HTMLInputElement>) {
  const t = e.target as HTMLInputElement;
  t.value = ('' + t.value).toUpperCase();
}
