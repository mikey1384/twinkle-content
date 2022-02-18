import React, { useEffect, useState } from 'react';

export default function Advertisement() {
  const [, setTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);
  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-9422244865978432"
      data-ad-slot="8704975620"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
