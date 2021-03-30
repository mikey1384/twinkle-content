import React from 'react';
import PropTypes from 'prop-types';
import ItemPanel from './ItemPanel';
import Icon from 'components/Icon';
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import { karmaPointTable, maxSizes } from 'constants/defaultValues';

const item = {
  maxLvl: 10,
  name: [
    'Expand maximum upload file size',
    'Expand maximum upload file size (level 2)',
    'Expand maximum upload file size (level 3)',
    'Expand maximum upload file size (level 4)',
    'Expand maximum upload file size (level 5)',
    'Expand maximum upload file size (level 6)',
    'Expand maximum upload file size (level 7)'
  ],
  description: maxSizes.map((currentSize, index) => {
    if (index === 0) {
      return `Unlock this item to expand your maximum upload file size to`;
    }
    return `Upgrade this item to expand your maximum upload file size to`;
  })
};

RewardBoostItem.propTypes = {
  style: PropTypes.object
};

export default function RewardBoostItem({ style }) {
  const { rewardBoostLvl, karmaPoints, userId } = useMyState();
  const {
    actions: { onUpdateProfileInfo }
  } = useContentContext();
  const {
    requestHelpers: { upgradeFileUploadSize }
  } = useAppContext();
  return (
    <ItemPanel
      isLeveled
      currentLvl={rewardBoostLvl}
      maxLvl={item.maxLvl}
      karmaPoints={karmaPoints}
      requiredKarmaPoints={karmaPointTable.rewardBoost[rewardBoostLvl]}
      locked={!rewardBoostLvl}
      onUnlock={handleUpgrade}
      itemName={item.name[rewardBoostLvl]}
      itemDescription={item.description[rewardBoostLvl]}
      style={style}
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
              Maximum upload file size - Level 7
            </p>
            <p style={{ fontSize: '1.7rem' }}>You can now upload files up to</p>
          </div>
        </div>
      </div>
    </ItemPanel>
  );

  async function handleUpgrade() {
    const success = await upgradeFileUploadSize();
    if (success) {
      onUpdateProfileInfo({ userId, rewardBoostLvl: rewardBoostLvl + 1 });
    }
  }
}
