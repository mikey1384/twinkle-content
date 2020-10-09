import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from 'contexts';
import Attempt from './Attempt';

Management.propTypes = {
  mission: PropTypes.object,
  missionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSetMissionState: PropTypes.func.isRequired
};

export default function Management({ mission, missionId, onSetMissionState }) {
  const {
    requestHelpers: { loadMissionAttempts }
  } = useAppContext();

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
