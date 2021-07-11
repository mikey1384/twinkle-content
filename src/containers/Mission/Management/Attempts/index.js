import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Attempt from './Attempt';
import FilterBar from 'components/FilterBar';
import Loading from 'components/Loading';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import { useAppContext } from 'contexts';

const displayedStatus = {
  fail: 'rejected',
  pending: 'pending',
  pass: 'approved'
};

Attempts.propTypes = {
  attemptObj: PropTypes.object,
  managementObj: PropTypes.object,
  selectedTab: PropTypes.string,
  onSelectTab: PropTypes.func.isRequired,
  onSetAttemptObj: PropTypes.func.isRequired,
  onSetManagementObj: PropTypes.func.isRequired
};

export default function Attempts({
  attemptObj,
  managementObj,
  selectedTab,
  onSelectTab,
  onSetAttemptObj,
  onSetManagementObj
}) {
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const {
    requestHelpers: { loadMissionAttempts }
  } = useAppContext();
  useEffect(() => {
    init();
    async function init() {
      setLoading(true);
      const {
        attemptObj,
        [`${selectedTab}AttemptIds`]: attemptIds,
        loadMoreButton
      } = await loadMissionAttempts({
        activeTab: selectedTab
      });
      onSetManagementObj({ [selectedTab]: attemptIds, loadMoreButton });
      onSetAttemptObj(attemptObj);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div style={{ width: '100%' }}>
      <FilterBar
        bordered
        style={{
          fontSize: '1.6rem',
          height: '5rem'
        }}
      >
        <nav
          className={selectedTab === 'pending' ? 'active' : null}
          onClick={() => onSelectTab('pending')}
        >
          Pending
        </nav>
        <nav
          className={selectedTab === 'pass' ? 'active' : null}
          onClick={() => onSelectTab('pass')}
        >
          Approved
        </nav>
        <nav
          className={selectedTab === 'fail' ? 'active' : null}
          onClick={() => onSelectTab('fail')}
        >
          Rejected
        </nav>
      </FilterBar>
      {loading ? (
        <Loading />
      ) : !managementObj[selectedTab] ||
        managementObj[selectedTab].length === 0 ? (
        <div
          style={{
            marginTop: '15rem',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            width: '100%',
            textAlign: 'center'
          }}
        >
          {`There are no ${displayedStatus[selectedTab]} attempts`}
        </div>
      ) : (
        <>
          {managementObj[selectedTab]?.map((attemptId, index) => {
            const attempt = attemptObj[attemptId];
            return (
              <Attempt
                key={attempt.id}
                activeTab={selectedTab}
                attempt={attempt}
                managementObj={managementObj}
                onSetManagementObj={onSetManagementObj}
                onSetAttemptObj={onSetAttemptObj}
                style={{ marginTop: index > 0 ? '1rem' : 0 }}
              />
            );
          })}
        </>
      )}
      {managementObj.loadMoreButton && !loading && (
        <LoadMoreButton
          style={{ marginTop: '2rem', fontSize: '1.7rem' }}
          filled
          color="green"
          loading={loadingMore}
          onClick={handleLoadMoreAttempts}
        />
      )}
    </div>
  );

  async function handleLoadMoreAttempts() {
    const currentAttemptIds = managementObj[selectedTab];
    setLoadingMore(true);
    const {
      attemptObj,
      [`${selectedTab}AttemptIds`]: attemptIds,
      loadMoreButton
    } = await loadMissionAttempts({
      activeTab: selectedTab,
      lastAttemptId: currentAttemptIds[currentAttemptIds.length - 1]
    });
    onSetManagementObj({ [selectedTab]: attemptIds, loadMoreButton });
    onSetAttemptObj(attemptObj);
    setLoadingMore(false);
  }
}
