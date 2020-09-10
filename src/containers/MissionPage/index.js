import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import Mission from './Mission';
import Tutorial from './Tutorial';
import InvalidPage from 'components/InvalidPage';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext, useMissionContext } from 'contexts';

MissionPage.propTypes = {
  match: PropTypes.object.isRequired
};

export default function MissionPage({
  match: {
    params: { missionId }
  }
}) {
  const { loaded, userId } = useMyState();
  const {
    requestHelpers: { loadMission, updateCurrentMission }
  } = useAppContext();
  const {
    actions: { onUpdateCurrentMission }
  } = useContentContext();
  const {
    actions: { onLoadMission },
    state: { taskObj }
  } = useMissionContext();

  const task = useMemo(() => taskObj[missionId] || {}, [missionId, taskObj]);

  useEffect(() => {
    if (userId) {
      updateCurrentMission(missionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    onUpdateCurrentMission({ missionId: Number(missionId), userId });
    if (!task.loaded) {
      init();
    }

    async function init() {
      const data = await loadMission(missionId);
      onLoadMission(data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loaded ? (
    userId ? (
      <div style={{ paddingTop: '1rem' }}>
        {task ? (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Mission
              missionId={task.id}
              description={task.description}
              subtitle={task.subtitle}
              missionType={task.missionType}
              title={task.title}
            />
            <Tutorial
              style={{ marginTop: '5rem' }}
              tutorialId={task.tutorialId}
            />
          </div>
        ) : (
          <Loading text="Loading Mission..." />
        )}
      </div>
    ) : (
      <InvalidPage
        title="For Registered Users Only"
        text="Please Log In or Sign Up"
      />
    )
  ) : (
    <Loading />
  );
}
