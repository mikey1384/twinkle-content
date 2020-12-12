import React from 'react';
import PropTypes from 'prop-types';
import FilterBar from 'components/FilterBar';

SubmittedQuestions.propTypes = {
  style: PropTypes.object,
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function SubmittedQuestions({
  style,
  mission,
  onSetMissionState
}) {
  const { managementTab: activeTab = 'pending' } = mission;
  return (
    <div style={style}>
      <FilterBar
        bordered
        style={{
          fontSize: '1.6rem',
          height: '5rem'
        }}
      >
        <nav
          className={activeTab === 'pending' ? 'active' : null}
          onClick={() => {
            onSetMissionState({
              missionId: mission.id,
              newState: { managementTab: 'pending' }
            });
          }}
        >
          Pending
        </nav>
        <nav
          className={activeTab === 'pass' ? 'active' : null}
          onClick={() => {
            onSetMissionState({
              missionId: mission.id,
              newState: { managementTab: 'pass' }
            });
          }}
        >
          Approved
        </nav>
      </FilterBar>
    </div>
  );
}
