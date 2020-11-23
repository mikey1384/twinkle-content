import React from 'react';
import ItemPanel from './ItemPanel';
import { useMyState } from 'helpers/hooks';

export default function ProfilePictureItem() {
  const { karmaPoints } = useMyState();
  return (
    <div>
      <ItemPanel
        karmaPoints={karmaPoints}
        requiredKarmaPoints={1000}
        locked
        itemName="Coming soon..."
        style={{ marginTop: '5rem' }}
      />
    </div>
  );
}
