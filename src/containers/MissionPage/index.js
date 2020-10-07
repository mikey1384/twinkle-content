import React, { useEffect, useMemo, useRef } from 'react';
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
  const mounted = useRef(true);
  const { loaded, userId } = useMyState();
  const {
    requestHelpers: { loadMission, updateCurrentMission }
  } = useAppContext();
  const {
    actions: { onUpdateCurrentMission }
  } = useContentContext();
  const {
    actions: { onLoadMission, onSetMissionState },
    state: { missionObj }
  } = useMissionContext();

  const mission = useMemo(() => missionObj[missionId] || {}, [
    missionId,
    missionObj
  ]);

  useEffect(() => {
    if (userId) {
      updateCurrentMission(missionId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    onUpdateCurrentMission({ missionId: Number(missionId), userId });
    if (!mission.loaded) {
      init();
    }

    async function init() {
      const data = await loadMission(missionId);
      if (mounted.current) {
        onLoadMission(data);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    mounted.current = true;

    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  return loaded ? (
    mission.id ? (
      userId ? (
        <div style={{ paddingTop: '1rem' }}>
          {mission ? (
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
                fileUploadProgress={mission.fileUploadProgress}
                fileUploadComplete={mission.fileUploadComplete}
                missionId={mission.id}
                attachment={mission.attachment}
                description={mission.description}
                subtitle={mission.subtitle}
                missionType={mission.missionType}
                objective={mission.objective}
                onSetMissionState={onSetMissionState}
                title={mission.title}
                status={mission.status}
              />
              <Tutorial
                missionId={mission.id}
                missionTitle={mission.title}
                style={{ marginTop: '5rem', marginBottom: '1rem' }}
                tutorialStarted={mission.tutorialStarted}
                onSetMissionState={onSetMissionState}
                tutorialId={mission.tutorialId}
                tutorialIsPublished={mission.tutorialIsPublished}
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
      <InvalidPage />
    )
  ) : (
    <Loading />
  );
}
