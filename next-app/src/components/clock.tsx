'use client';

import { getUTCDateString, getUTCTimeString } from '@/util/date.util';
import { useEffect, useState } from 'react';

export function Clock() {
  const [time, setTime] = useState(new Date(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="text-sm">{getUTCDateString(time)}</div>
      <div className="text-2xl">{getUTCTimeString(time)}</div>
    </div>
  );
}
