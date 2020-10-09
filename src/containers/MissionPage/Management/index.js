import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Attempt from './Attempt';
import FilterBar from 'components/FilterBar';
import { useAppContext } from 'contexts';

Management.propTypes = {
  mission: PropTypes.object,
  missionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSetMissionState: PropTypes.func.isRequired
};

export default function Management({ mission, missionId, onSetMissionState }) {
  const {
    requestHelpers: { loadMissionAttempts }
  } = useAppContext();
  const { managementTab: activeTab = 'pending' } = mission;

  useEffect(() => {
    init();
    async function init() {
      const data = await loadMissionAttempts(missionId);
      onSetMissionState({
        missionId,
        newState: {
          attempts: data
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ width: '100%', marginBottom: '10rem' }}>
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
              missionId,
              newState: { managementTab: 'pending' }
            });
          }}
        >
          Pending
        </nav>
        <nav
          className={activeTab === 'approved' ? 'active' : null}
          onClick={() => {
            onSetMissionState({
              missionId,
              newState: { managementTab: 'approved' }
            });
          }}
        >
          Approved
        </nav>
        <nav
          className={activeTab === 'rejected' ? 'active' : null}
          onClick={() =>
            onSetMissionState({
              missionId,
              newState: { managementTab: 'rejected' }
            })
          }
        >
          Rewards
        </nav>
      </FilterBar>
      {mission.attempts?.map((attempt, index) => (
        <Attempt
          key={attempt.id}
          attempt={attempt}
          style={{ marginTop: index > 0 ? '1rem' : 0 }}
        />
      ))}
    </div>
  );
}
