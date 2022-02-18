import React, { useEffect } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import { addEvent, removeEvent } from 'helpers/listenerHelpers';

export default function Advertisement() {
  useEffect(() => {
    addEvent(window, 'load', handleLoad);
    return function cleanUp() {
      removeEvent(window, 'load', handleLoad);
    };
    function handleLoad() {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  });
  return (
    <ErrorBoundary>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9422244865978432"
        data-ad-slot="8704975620"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </ErrorBoundary>
  );
}
