import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import MissionItem from './MissionItem';
import ErrorBoundary from 'components/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import { mobileMaxWidth } from 'constants/css';
import { useMyState } from 'helpers/hooks';
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
    } else {
      setSelectedTab('ongoing');
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
                width: CALC(100% + 2rem) !important;
                margin-left: -1rem;
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
                  <MissionItem
                    style={{ marginTop: index > 0 ? '1rem' : 0 }}
                    key={missionId}
                    mission={mission}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
