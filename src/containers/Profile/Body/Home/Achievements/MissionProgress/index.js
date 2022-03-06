import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import SectionPanel from 'components/SectionPanel';
import localize from 'constants/localize';
import MissionItem from './MissionItem';
import { SELECTED_LANGUAGE } from 'constants/defaultValues';
import { css } from '@emotion/css';
import { useAppContext } from 'contexts';

const missionProgressLabel = localize('missionProgress');
const completeLabel = localize('complete');
const incompleteLabel = localize('incomplete');

MissionProgress.propTypes = {
  selectedTheme: PropTypes.string,
  style: PropTypes.object,
  username: PropTypes.string,
  userId: PropTypes.number
};

export default function MissionProgress({
  selectedTheme,
  style,
  userId,
  username
}) {
  const loadMissionProgress = useAppContext(
    (v) => v.requestHelpers.loadMissionProgress
  );
  const [missions, setMissions] = useState([]);
  const [selectedMissionListTab, setSelectedMissionListTab] = useState('');
  const [loaded, setLoaded] = useState(false);
  const mounted = useRef(true);

  const allMissionsCompleteLabel = useMemo(() => {
    if (SELECTED_LANGUAGE === 'kr') {
      return `${username}님은 모든 미션을 완료했습니다`;
    }
    return `${username} has completed all available missions`;
  }, [username]);
  const noMissionsCompleteLabel = useMemo(() => {
    if (SELECTED_LANGUAGE === 'kr') {
      return `${username}님은 아직 어떤 미션도 완료하지 못했습니다`;
    }
    return `${username} has not completed any missions yet`;
  }, [username]);

  const filteredMissions = useMemo(() => {
    return missions.filter((mission) =>
      selectedMissionListTab === 'complete'
        ? mission.status === 'pass'
        : mission.status !== 'pass'
    );
  }, [missions, selectedMissionListTab]);

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
        <FilterBar bordered style={{ fontSize: '1.5rem', height: '5rem' }}>
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
            {incompleteLabel}
          </nav>
        </FilterBar>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            padding: '2rem 0'
          }}
        >
          <div
            className={css`
              display: flex;
              height: auto;
              flex-wrap: wrap;
              margin-bottom: ${missions.length > 0 ? '-1rem' : 0};
            `}
          >
            {filteredMissions.length > 0 ? (
              <>
                {filteredMissions.map((mission) => (
                  <MissionItem
                    key={mission.key}
                    style={{ marginRight: '1rem', marginBottom: '1rem' }}
                    completed={selectedMissionListTab === 'complete'}
                    taskProgress={mission.taskProgress}
                    missionName={mission.name}
                    missionType={mission.key}
                  />
                ))}
              </>
            ) : (
              <div
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '2rem',
                  paddingTop: '5rem',
                  paddingBottom: '5rem',
                  fontWeight: 'bold'
                }}
              >
                {selectedMissionListTab === 'complete'
                  ? noMissionsCompleteLabel
                  : allMissionsCompleteLabel}
              </div>
            )}
          </div>
        </div>
      </SectionPanel>
    </ErrorBoundary>
  );
}
