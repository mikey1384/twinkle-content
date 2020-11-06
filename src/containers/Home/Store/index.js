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
        requiredKarmaPoints={100}
        itemName="Change your username"
        itemDescription="Unlock this item to change your username anytime"
        style={{ marginTop: '1rem' }}
      />
    </div>
  );
}
