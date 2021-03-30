import React from 'react';
import PropTypes from 'prop-types';
import ItemPanel from './ItemPanel';
import Icon from 'components/Icon';
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import { karmaPointTable, videoRewardHash } from 'constants/defaultValues';

const item = {
  maxLvl: 10,
  name: [
    'Boost rewards from watching XP Videos',
    'Boost rewards from watching XP Videos (level 2)',
    'Boost rewards from watching XP Videos (level 3)',
    'Boost rewards from watching XP Videos (level 4)',
    'Boost rewards from watching XP Videos (level 5)',
    'Boost rewards from watching XP Videos (level 6)',
    'Boost rewards from watching XP Videos (level 7)',
    'Boost rewards from watching XP Videos (level 8)',
    'Boost rewards from watching XP Videos Videoseos (level 9)',
    'Boost rewards from watching XP Videos (level 10)'
  ],
  description: Object.keys(videoRewardHash).map((key) => {
    if (key === 0) {
      return (
        <div key={key}>Unlock this item to earn the following rewards</div>
      );
    }
    return <div key={key}>Upgrade this item to earn the following rewards</div>;
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
