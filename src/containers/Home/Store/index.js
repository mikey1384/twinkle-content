import React from 'react';
import KarmaStatus from './KarmaStatus';
import ItemPanel from './ItemPanel';

export default function Store() {
  return (
    <div>
      <KarmaStatus />
      <ItemPanel style={{ marginTop: '1rem' }} />
    </div>
  );
}
