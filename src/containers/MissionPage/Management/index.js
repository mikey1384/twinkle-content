import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Attempt from './Attempt';
import FilterBar from 'components/FilterBar';
import Loading from 'components/Loading';
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    init();
    async function init() {
      setLoading(true);
      const {
        attemptObj,
        [`${activeTab}AttemptIds`]: attemptIds
      } = await loadMissionAttempts({
        activeTab,
        missionId
      });
      onSetMissionState({
        missionId,
        newState: {
          [`${activeTab}AttemptIds`]: attemptIds,
          attemptObj: { ...mission.attemptObj, ...attemptObj }
        }
      });
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

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
      {loading ? (
        <Loading />
      ) : (
        <>
          {mission[`${activeTab}AttemptIds`]?.map((attemptId, index) => {
            const attempt = mission.attemptObj[attemptId];
            return (
              <Attempt
                key={attempt.id}
                attempt={attempt}
                style={{ marginTop: index > 0 ? '1rem' : 0 }}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
