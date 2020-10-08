import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import Main from './Main';
import RightMenu from './RightMenu';
import InvalidPage from 'components/InvalidPage';
import Management from './Management';
import { Switch, Route } from 'react-router-dom';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext, useMissionContext } from 'contexts';

MissionPage.propTypes = {
  match: PropTypes.object.isRequired
};

export default function MissionPage({
  match: {
    path,
    params: { missionId }
  }
}) {
  const mounted = useRef(true);
  const { loaded, userId, canEdit } = useMyState();
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
  const prevUserId = useRef(userId);

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
    if (!mission.loaded || (userId && prevUserId.current !== userId)) {
      init();
    }
    prevUserId.current = userId;

    async function init() {
      const data = await loadMission(missionId);
      if (mounted.current) {
        onLoadMission(data);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    mounted.current = true;

    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  return loaded ? (
    mission.id ? (
      userId ? (
        <div
          style={{
            paddingTop: '1rem',
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: canEdit ? 'CALC(100% - 55rem)' : '60%',
              ...(canEdit
                ? { marginLeft: '25rem' }
                : {
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column'
                  })
            }}
          >
            <Switch>
              <Route
                exact
                path={path}
                render={() => (
                  <Main
                    canEdit={canEdit}
                    onSetMissionState={onSetMissionState}
                    mission={mission}
                  />
                )}
              />
              <Route
                exact
                path={`${path}/manage`}
                render={() => <Management />}
              />
            </Switch>
          </div>
          {canEdit && (
            <RightMenu style={{ width: '25rem', marginLeft: '5rem' }} />
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
