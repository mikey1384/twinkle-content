import React from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import RewardText from 'components/Texts/RewardText';
import ErrorBoundary from 'components/ErrorBoundary';
import { gifTable } from 'constants/defaultValues';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

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
            {missions.map((missionId, index) => {
              const mission = missionObj[missionId];
              return (
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
                    {mission.title}
                  </p>
                  <div style={{ marginTop: '1rem', display: 'flex' }}>
                    <img
                      src={gifTable[missionId]}
                      style={{ width: '10rem', height: '6rem' }}
                    />
                    <div
                      style={{
                        marginLeft: '1rem',
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div
                        style={{ width: '100%' }}
                        className={css`
                          font-size: 1.7rem;
                          @media (max-width: ${mobileMaxWidth}) {
                            font-size: 1.3rem;
                          }
                        `}
                      >
                        {mission.subtitle}
                      </div>
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                          marginTop: '1.5rem'
                        }}
                      >
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
                          rewardStyle={{ fontSize: '1.2rem' }}
                          coinReward={mission.coinReward}
                          xpReward={mission.xpReward}
                        />
                        {mission.myAttempt?.status &&
                          mission.myAttempt?.status !== 'pending' && (
                            <div
                              className={css`
                                font-size: 1.3rem;
                                @media (max-width: ${mobileMaxWidth}) {
                                  font-size: 1.1rem;
                                }
                              `}
                              style={{
                                fontWeight: 'bold',
                                color:
                                  mission.myAttempt?.status === 'pass'
                                    ? Color.green()
                                    : Color.rose()
                              }}
                            >
                              {mission.myAttempt?.status}ed
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </ListItem>
              );
            })}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
