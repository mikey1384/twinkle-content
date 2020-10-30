import React from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import RewardText from 'components/Texts/RewardText';
import ErrorBoundary from 'components/ErrorBoundary';
import { gifTable } from 'constants/defaultValues';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

MissionList.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  missions: PropTypes.array.isRequired,
  missionObj: PropTypes.object.isRequired
};

export default function MissionList({
  style,
  className,
  missions,
  missionObj
}) {
  return (
    <ErrorBoundary>
      <div style={style} className={className}>
        <p style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>All Missions</p>
        <div>
          <div style={{ marginTop: '1rem' }}>
            {missions.map((missionId, index) => (
              <ListItem
                style={{ marginTop: index > 0 ? '1rem' : 0 }}
                key={missionId}
                missionId={missionId}
              >
                <p
                  className={css`
                    font-size: 2rem;
                    font-weight: bold;
                    @media (max-width: ${mobileMaxWidth}) {
                      font-size: 1.7rem;
                    }
                  `}
                >
                  {missionObj[missionId].title}
                </p>
                <div style={{ marginTop: '1rem', display: 'flex' }}>
                  <img
                    src={gifTable[missionId]}
                    style={{ width: '10rem', height: '6rem' }}
                  />
                  <div style={{ marginLeft: '1rem' }}>
                    <div
                      className={css`
                        font-size: 1.7rem;
                        @media (max-width: ${mobileMaxWidth}) {
                          font-size: 1.3rem;
                        }
                      `}
                    >
                      {missionObj[missionId].subtitle}
                    </div>
                    <RewardText
                      labelClassName={css`
                        color: ${Color.darkerGray()};
                        font-size: 1.4rem;
                        @media (max-width: ${mobileMaxWidth}) {
                          font-size: 1.3rem;
                        }
                      `}
                      rewardClassName={css`
                        font-size: 1.3rem;
                        @media (max-width: ${mobileMaxWidth}) {
                          font-size: 1.2rem;
                        }
                      `}
                      style={{ marginTop: '1.5rem' }}
                      rewardStyle={{ fontSize: '1.2rem' }}
                      coinReward={missionObj[missionId].coinReward}
                      xpReward={missionObj[missionId].xpReward}
                    />
                  </div>
                </div>
              </ListItem>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
