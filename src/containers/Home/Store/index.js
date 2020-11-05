import React, { useState } from 'react';
import KarmaStatus from './KarmaStatus';
import ItemPanel from './ItemPanel';

export default function Store() {
  const [karmaPoints, setKarmaPoints] = useState(0);

  return (
    <div>
      <KarmaStatus
        karmaPoints={karmaPoints}
        onSetKarmaPoints={setKarmaPoints}
      />
      <ItemPanel
        karmaPoints={karmaPoints}
        itemName="Change your username"
        style={{ marginTop: '1rem' }}
      />
    </div>
  );
}
