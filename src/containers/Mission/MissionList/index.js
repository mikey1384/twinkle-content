import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import RewardText from 'components/Texts/RewardText';
import ErrorBoundary from 'components/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import { useMyState } from 'helpers/hooks';
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
  const { userId } = useMyState();
  const [selectedTab, setSelectedTab] = useState('ongoing');
  const ongoingMissions = useMemo(() => {
    return missions.filter(
      (missionId) => missionObj[missionId].myAttempt?.status !== 'pass'
    );
  }, [missionObj, missions]);
  const completedMissions = useMemo(() => {
    return missions.filter(
      (missionId) => missionObj[missionId].myAttempt?.status === 'pass'
    );
  }, [missionObj, missions]);
  useEffect(() => {
    if (ongoingMissions.length === 0) {
      setSelectedTab('complete');
    }
  }, [ongoingMissions.length]);
  let displayedMissions = useMemo(() => {
    if (userId) {
      if (selectedTab === 'ongoing') {
        return ongoingMissions;
      }
      return completedMissions;
    }
    return missions;
  }, [completedMissions, missions, ongoingMissions, selectedTab, userId]);

  return (
    <ErrorBoundary>
      <div style={style} className={className}>
        <p style={{ fontWeight: 'bold', fontSize: '2.5rem' }}>All Missions</p>
        {userId && (
          <FilterBar
            className={css`
              @media (max-width: ${mobileMaxWidth}) {
                width: auto;
                margin-left: -1rem;
                margin-right: -1rem;
              }
            `}
            style={{ marginTop: '1rem' }}
            bordered
          >
            <nav
              className={selectedTab === 'ongoing' ? 'active' : ''}
              onClick={() => setSelectedTab('ongoing')}
            >
              In Progress
            </nav>
            <nav
              className={selectedTab === 'complete' ? 'active' : ''}
              onClick={() => setSelectedTab('complete')}
            >
              Complete
            </nav>
          </FilterBar>
        )}
        <div>
          <div style={{ marginTop: '1rem' }}>
            {displayedMissions.length === 0 ? (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '18rem',
                  fontWeight: 'bold',
                  fontSize: '2rem'
                }}
              >
                {selectedTab === 'ongoing'
                  ? 'You have completed every available mission'
                  : `You haven't completed any mission, yet`}
              </div>
            ) : (
              displayedMissions.map((missionId, index) => {
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
              })
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
