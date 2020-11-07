import React, { useState } from 'react';
import KarmaStatus from './KarmaStatus';
import ItemPanel from './ItemPanel';
import ChangeUsername from './ChangeUsername';
import { priceTable } from 'constants/defaultValues';
import { useMyState } from 'helpers/hooks';

export default function Store() {
  const { canChangeUsername } = useMyState();
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
        locked={!canChangeUsername}
        itemName="Change your username"
        itemDescription={`Unlock this item to change your username anytime you want for ${priceTable.username} Twinkle Coins`}
        style={{ marginTop: '1rem' }}
      >
        <ChangeUsername style={{ marginTop: '1rem' }} />
      </ItemPanel>
    </div>
  );
}
