import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Attempt from './Attempt';
import FilterBar from 'components/FilterBar';
import Loading from 'components/Loading';
import InvalidPage from 'components/InvalidPage';
import ErrorBoundary from 'components/ErrorBoundary';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import { useAppContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

Management.propTypes = {
  mission: PropTypes.object,
  missionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSetMissionState: PropTypes.func.isRequired
};

const displayedStatus = {
  fail: 'rejected',
  pending: 'pending',
  pass: 'approved'
};

export default function Management({ mission, missionId, onSetMissionState }) {
  const {
    requestHelpers: { loadMissionAttempts }
  } = useAppContext();
  const { canEdit } = useMyState();
  const { managementTab: activeTab = 'pending' } = mission;
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (canEdit) {
      init();
    }
    async function init() {
      setLoading(true);
      const {
        attemptObj,
        [`${activeTab}AttemptIds`]: attemptIds,
        loadMoreButton
      } = await loadMissionAttempts({
        activeTab,
        missionId
      });
      onSetMissionState({
        missionId,
        newState: {
          [`${activeTab}AttemptIds`]: attemptIds,
          attemptObj: { ...mission.attemptObj, ...attemptObj },
          loadMoreButton
        }
      });
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, canEdit]);

  if (!canEdit) {
    return (
      <InvalidPage
        title="For moderators only"
        text="You are not authorized to view this page"
      />
    );
  }

  return (
    <ErrorBoundary style={{ width: '100%', marginBottom: '10rem' }}>
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
          className={activeTab === 'pass' ? 'active' : null}
          onClick={() => {
            onSetMissionState({
              missionId,
              newState: { managementTab: 'pass' }
            });
          }}
        >
          Approved
        </nav>
        <nav
          className={activeTab === 'fail' ? 'active' : null}
          onClick={() =>
            onSetMissionState({
              missionId,
              newState: { managementTab: 'fail' }
            })
          }
        >
          Rejected
        </nav>
      </FilterBar>
      {loading ? (
        <Loading />
      ) : !mission[`${activeTab}AttemptIds`] ||
        mission[`${activeTab}AttemptIds`].length === 0 ? (
        <div
          style={{
            marginTop: '15rem',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            width: '100%',
            textAlign: 'center'
          }}
        >
          {`There are no ${displayedStatus[activeTab]} attempts`}
        </div>
      ) : (
        <>
          {mission[`${activeTab}AttemptIds`]?.map((attemptId, index) => {
            const attempt = mission.attemptObj[attemptId];
            return (
              <Attempt
                key={attempt.id}
                activeTab={activeTab}
                attempt={attempt}
                style={{ marginTop: index > 0 ? '1rem' : 0 }}
                onSetMissionState={onSetMissionState}
                mission={mission}
              />
            );
          })}
        </>
      )}
      {mission.loadMoreButton && (
        <LoadMoreButton
          style={{ marginTop: '2rem', fontSize: '1.7rem' }}
          filled
          color="green"
          loading={loadingMore}
          onClick={handleLoadMoreAttempts}
        >
          Load More button!
        </LoadMoreButton>
      )}
    </ErrorBoundary>
  );

  async function handleLoadMoreAttempts() {
    const currentAttemptIds = mission[`${activeTab}AttemptIds`];
    setLoadingMore(true);
    const {
      attemptObj,
      [`${activeTab}AttemptIds`]: attemptIds,
      loadMoreButton
    } = await loadMissionAttempts({
      activeTab,
      missionId,
      lastAttemptId: currentAttemptIds[currentAttemptIds.length - 1]
    });
    onSetMissionState({
      missionId,
      newState: {
        [`${activeTab}AttemptIds`]: currentAttemptIds.concat(attemptIds),
        attemptObj: { ...mission.attemptObj, ...attemptObj },
        loadMoreButton
      }
    });
    setLoadingMore(false);
  }
}
