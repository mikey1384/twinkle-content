import React, { useState } from 'react';
import KarmaStatus from './KarmaStatus';
import ItemPanel from './ItemPanel';
import ChangeUsername from './ChangeUsername';
import { useAppContext, useContentContext } from 'contexts';
import { priceTable, karmaPointTable } from 'constants/defaultValues';
import { useMyState } from 'helpers/hooks';

export default function Store() {
  const {
    requestHelpers: { unlockUsernameChange }
  } = useAppContext();
  const {
    actions: { onUpdateProfileInfo }
  } = useContentContext();
  const { canChangeUsername, fileUploadLvl = 0, userId } = useMyState();
  const [karmaPoints, setKarmaPoints] = useState(0);

  return (
    <div style={{ paddingBottom: '15rem' }}>
      <KarmaStatus
        karmaPoints={karmaPoints}
        onSetKarmaPoints={setKarmaPoints}
      />
      <ItemPanel
        karmaPoints={karmaPoints}
        requiredKarmaPoints={karmaPointTable.username}
        locked={!canChangeUsername}
        itemName="Change your username"
        itemDescription={`Unlock this item to change your username anytime you want for ${priceTable.username} Twinkle Coins`}
        onUnlock={handleUnlockUsernameChange}
        style={{ marginTop: userId ? '5rem' : '1rem' }}
      >
        <ChangeUsername style={{ marginTop: '1rem' }} />
      </ItemPanel>
      <ItemPanel
        isLeveled
        currentLvl={fileUploadLvl}
        maxLvl={7}
        karmaPoints={karmaPoints}
        requiredKarmaPoints={karmaPointTable.file[fileUploadLvl]}
        locked={!fileUploadLvl}
        onUnlock={() => console.log('unlocking')}
        itemName={
          {
            0: 'Expand upload file size limit (level 1)',
            1: 'Expand upload file size limit (level 2)',
            2: 'Expand upload file size limit (level 3)',
            3: 'Expand upload file size limit (level 4)',
            4: 'Expand upload file size limit (level 5)',
            5: 'Expand upload file size limit (level 6)',
            6: 'Expand upload file size limit (level 7)'
          }[fileUploadLvl]
        }
        itemDescription={
          {
            0: 'Unlock this item to upload files up to 500 MB in size',
            1: 'Unlock this item to upload files up to 750 MB in size',
            2: 'Unlock this item to upload files up to 1 GB in size',
            3: 'Unlock this item to upload files up to 1.25 GB in size',
            4: 'Unlock this item to upload files up to 1.5 GB in size',
            5: 'Unlock this item to upload files up to 1.75 GB in size',
            6: 'Unlock this item to upload files up to 2 GB in size'
          }[fileUploadLvl]
        }
        style={{ marginTop: '5rem' }}
      />
      <ItemPanel
        karmaPoints={karmaPoints}
        requiredKarmaPoints={1000}
        locked
        itemName="Coming soon..."
        style={{ marginTop: '5rem' }}
      />
      <ItemPanel
        karmaPoints={karmaPoints}
        requiredKarmaPoints={5000}
        locked
        itemName="Coming soon..."
        style={{ marginTop: '5rem' }}
      />
      <ItemPanel
        karmaPoints={karmaPoints}
        requiredKarmaPoints={10000}
        locked
        itemName="Coming soon..."
        style={{ marginTop: '5rem' }}
      />
    </div>
  );

  async function handleUnlockUsernameChange() {
    const success = await unlockUsernameChange();
    if (success) {
      onUpdateProfileInfo({ userId, canChangeUsername: true });
    }
  }
}
