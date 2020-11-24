import React from 'react';
import ItemPanel from './ItemPanel';
import Icon from 'components/Icon';
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import { karmaPointTable } from 'constants/defaultValues';

const item = {
  maxLvl: 7,
  name: [
    'Post pictures on your profile page',
    'Post pictures on your profile page (level 2)',
    'Post pictures on your profile page (level 3)',
    'Post pictures on your profile page (level 4)',
    'Post pictures on your profile page (level 5)',
    'Post pictures on your profile page (level 6)',
    'Post pictures on your profile page (level 7)'
  ]
};

export default function ProfilePictureItem() {
  const { karmaPoints, numPics = 0, userId } = useMyState();
  const {
    requestHelpers: { upgradeNumPics }
  } = useAppContext();
  const {
    actions: { onUpdateProfileInfo }
  } = useContentContext();
  return (
    <ItemPanel
      isLeveled
      currentLvl={numPics}
      maxLvl={item.maxLvl}
      karmaPoints={karmaPoints}
      requiredKarmaPoints={karmaPointTable.profilePicture[numPics]}
      locked={!numPics}
      onUnlock={handleUpgrade}
      itemName={item.name[numPics]}
      itemDescription={
        numPics > 0
          ? `Upgrade this item to post up to ${numPics} pictures on you profile page`
          : 'Unlock this item to post pictures on your profile page'
      }
      style={{ marginTop: '5rem' }}
      upgradeIcon={<Icon size="3x" icon="upload" />}
    >
      <div
        style={{
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', fontSize: '2rem' }}
        >
          <Icon size="3x" icon="upload" />
          <div
            style={{
              marginLeft: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>
              Profile Pictures - Level 7
            </p>
            <p style={{ fontSize: '1.7rem' }}>
              You can now post up to {numPics} pictures on your profile page
            </p>
          </div>
        </div>
      </div>
    </ItemPanel>
  );

  async function handleUpgrade() {
    const success = await upgradeNumPics();
    if (success) {
      onUpdateProfileInfo({ userId, numPics: numPics + 1 });
    }
  }
}
