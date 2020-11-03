import React from 'react';
import KarmaStatus from './KarmaStatus';
import ItemPanel from './ItemPanel';

export default function Store() {
  return (
    <div>
      <KarmaStatus />
      <ItemPanel
        itemName="Change your username"
        style={{ marginTop: '1rem' }}
      />
    </div>
  );
}
