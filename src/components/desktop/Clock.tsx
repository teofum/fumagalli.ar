import { useEffect, useState } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span>
      {time.getHours()} : {time.getMinutes().toString().padStart(2, '0')}
    </span>
  );
}
