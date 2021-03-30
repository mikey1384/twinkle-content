import React from 'react';
import PropTypes from 'prop-types';
import ItemPanel from './ItemPanel';
import Icon from 'components/Icon';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
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
    'Boost rewards from watching XP Videos (level 9)',
    'Boost rewards from watching XP Videos (level 10)'
  ],
  description: [...Array(10).keys()].map((key) => {
    const rewardLevels = [1, 2, 3, 4, 5];
    const colorKey = ['logoBlue', 'pink', 'orange', 'cranberry', 'gold'];
    const keyNumber = Number(key);
    return (
      <div style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }} key={key}>
        <p>
          {keyNumber === 0 ? 'Unlock' : 'Upgrade'} this item to earn the
          following rewards{' '}
          <b style={{ color: Color.orange() }}>every minute</b> while watching
          XP Videos
        </p>
        <div
          style={{
            width: '100%',
            marginTop: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative'
          }}
        >
          {rewardLevels.map((rewardLevel, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                width: '80%',
                justifyContent: 'space-between',
                marginTop: index === 0 ? 0 : '1rem'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: `8rem`,
                  justifyContent: 'center'
                }}
              >
                <div
                  className={css`
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-width: 4rem;
                    padding: 0.5rem 0.5rem;
                    background: ${Color[colorKey[index]]()};
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #fff;
                    @media (max-width: ${mobileMaxWidth}) {
                      font-size: 1rem;
                    }
                  `}
                >
                  <div style={{ fontSize: '1rem', lineHeight: 1 }}>
                    {[...Array(rewardLevel)].map((elem, index) => (
                      <Icon
                        key={index}
                        style={{ verticalAlign: 0 }}
                        icon="star"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginLeft: '3rem',
                  flexGrow: 1
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    width: '95%',
                    justifyContent: 'space-around'
                  }}
                >
                  <div>
                    {videoRewardHash[keyNumber].xp * rewardLevel} XP
                    {rewardLevel > 2 ? (
                      <span>
                        {`, `}
                        <span style={{ marginLeft: '0.5rem' }}>
                          <Icon icon={['far', 'badge-dollar']} />{' '}
                          {videoRewardHash[keyNumber].coin}
                        </span>
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                  <div style={{ color: Color.green() }}>
                    <Icon icon="arrow-right" />
                  </div>
                  <div
                    style={{
                      fontWeight: 'bold',
                      color: Color.brownOrange()
                    }}
                  >
                    {videoRewardHash[keyNumber + 1].xp * rewardLevel} XP
                    {rewardLevel > 2 ? (
                      <span>
                        {`, `}
                        <span style={{ marginLeft: '0.5rem' }}>
                          <Icon icon={['far', 'badge-dollar']} />{' '}
                          {videoRewardHash[keyNumber + 1].coin}
                        </span>
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
      upgradeIcon={<Icon size="3x" icon="bolt" />}
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
              XP Video Reward Boost - Level 10
            </p>
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
