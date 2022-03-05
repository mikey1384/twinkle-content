import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import SectionPanel from 'components/SectionPanel';
import localize from 'constants/localize';
import MissionItem from './MissionItem';
import { css } from '@emotion/css';
import { useAppContext } from 'contexts';

const missionProgressLabel = localize('missionProgress');
const completeLabel = localize('complete');
const inProgressLabel = localize('inProgress');

MissionProgress.propTypes = {
  selectedTheme: PropTypes.string,
  style: PropTypes.object,
  userId: PropTypes.number
};

export default function MissionProgress({ selectedTheme, style, userId }) {
  const loadMissionProgress = useAppContext(
    (v) => v.requestHelpers.loadMissionProgress
  );
  const [missions, setMissions] = useState([]);
  const [selectedMissionListTab, setSelectedMissionListTab] = useState('');
  const [loaded, setLoaded] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (userId) {
      handleLoadMissionProgress(userId);
    }

    async function handleLoadMissionProgress(userId) {
      setLoaded(false);
      setMissions([]);
      const missions = await loadMissionProgress(userId);
      const passedMissions = [];
      for (let mission of missions) {
        if (mission.status === 'pass') {
          passedMissions.push(mission);
        }
      }
      if (mounted.current) {
        if (passedMissions.length > 0) {
          setSelectedMissionListTab('complete');
        } else {
          setSelectedMissionListTab('ongoing');
        }
      }
      if (mounted.current) {
        setMissions(missions);
      }
      if (mounted.current) {
        setLoaded(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <ErrorBoundary>
      <SectionPanel
        customColorTheme={selectedTheme}
        title={missionProgressLabel}
        loaded={loaded}
        style={style}
      >
        <FilterBar bordered>
          <nav
            className={selectedMissionListTab === 'complete' ? 'active' : ''}
            onClick={() => setSelectedMissionListTab('complete')}
          >
            {completeLabel}
          </nav>
          <nav
            className={selectedMissionListTab === 'ongoing' ? 'active' : ''}
            onClick={() => setSelectedMissionListTab('ongoing')}
          >
            {inProgressLabel}
          </nav>
        </FilterBar>
        <div
          style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
        >
          <div
            className={css`
              display: flex;
              height: auto;
              flex-wrap: wrap;
              margin-bottom: ${missions.length > 0 ? '-1rem' : 0};
            `}
          >
            {missions
              .filter((mission) =>
                selectedMissionListTab === 'complete'
                  ? mission.status === 'pass'
                  : mission.status !== 'pass'
              )
              .map((mission) => (
                <MissionItem
                  key={mission.key}
                  style={{ marginRight: '1rem', marginBottom: '1rem' }}
                  missionName={mission.name}
                  missionType={mission.key}
                />
              ))}
          </div>
        </div>
      </SectionPanel>
    </ErrorBoundary>
  );
}
