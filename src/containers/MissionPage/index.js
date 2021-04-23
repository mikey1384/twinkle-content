import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import Main from './Main';
import RightMenu from './RightMenu';
import InvalidPage from 'components/InvalidPage';
import Management from './Management';
import FilterBar from 'components/FilterBar';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from '@emotion/css';
import { mobileMaxWidth } from 'constants/css';
import { Switch, Route, useLocation, useHistory } from 'react-router-dom';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext, useMissionContext } from 'contexts';

MissionPage.propTypes = {
  match: PropTypes.object.isRequired
};

export default function MissionPage({
  match: {
    path,
    params: { missionType }
  }
}) {
  const mounted = useRef(true);
  const history = useHistory();
  const location = useLocation();
  const { loaded, userId, isCreator } = useMyState();
  const {
    requestHelpers: { loadMission, loadMissionTypeIdHash, updateCurrentMission }
  } = useAppContext();
  const {
    actions: { onUpdateCurrentMission }
  } = useContentContext();
  const {
    actions: { onLoadMission, onLoadMissionTypeIdHash, onSetMissionState },
    state: { missionObj, prevUserId, missionTypeIdHash }
  } = useMissionContext();

  const missionId = useMemo(() => {
    return missionTypeIdHash?.[missionType];
  }, [missionTypeIdHash, missionType]);

  useEffect(() => {
    if (missionId && userId) {
      handleUpdateCurrentMission();
    }

    async function handleUpdateCurrentMission() {
      await updateCurrentMission(missionId);
      onUpdateCurrentMission({ missionId, userId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionId, userId]);

  const mission = useMemo(() => missionObj[missionId] || {}, [
    missionId,
    missionObj
  ]);

  useEffect(() => {
    if (!missionId) {
      getMissionId();
    } else if (!mission.loaded || (userId && prevUserId !== userId)) {
      init();
    }

    async function getMissionId() {
      const data = await loadMissionTypeIdHash();
      onLoadMissionTypeIdHash(data);
    }

    async function init() {
      if (userId) {
        const data = await loadMission(missionId);
        if (mounted.current) {
          onLoadMission({ mission: data, prevUserId: userId });
        }
      } else {
        onLoadMission({ mission: { id: missionId }, prevUserId: userId });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, prevUserId, missionId, mission.loaded]);

  useEffect(() => {
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  if (!loaded) {
    return <Loading />;
  }

  if (
    userId &&
    missionType &&
    missionTypeIdHash &&
    !missionTypeIdHash[missionType]
  ) {
    return <InvalidPage />;
  }

  return userId ? (
    mission.loaded ? (
      <ErrorBoundary style={{ width: '100%', paddingBottom: '10rem' }}>
        {isCreator && (
          <FilterBar
            className="mobile"
            bordered
            style={{
              fontSize: '1.6rem',
              height: '5rem'
            }}
          >
            <nav
              className={
                location.pathname === `/missions/${missionType}` ? 'active' : ''
              }
              onClick={() => history.push(`/missions/${missionType}`)}
            >
              Mission
            </nav>
            <nav
              className={
                location.pathname === `/missions/${missionType}/manage`
                  ? 'active'
                  : ''
              }
              onClick={() => history.push(`/missions/${missionType}/manage`)}
            >
              Manage
            </nav>
          </FilterBar>
        )}
        <div
          className={css`
            padding-top: 1rem;
            @media (max-width: ${mobileMaxWidth}) {
              padding-top: ${isCreator ? '0.5rem' : 0};
            }
          `}
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <div
            className={css`
              display: flex;
              width: ${isCreator ? 'CALC(100% - 55rem)' : '60%'};
              ${isCreator
                ? 'margin-left: 25rem;'
                : `
                    justify-content: center;
                    flex-direction: column;`}
              @media (max-width: ${mobileMaxWidth}) {
                margin-left: 0;
                width: 100%;
              }
            `}
          >
            <Switch>
              <Route
                exact
                path={`/missions/${missionType}/manage`}
                render={() => (
                  <Management
                    missionId={missionId}
                    mission={mission}
                    onSetMissionState={onSetMissionState}
                  />
                )}
              />
              <Route
                exact
                path={path}
                render={() => (
                  <Main
                    onSetMissionState={onSetMissionState}
                    mission={mission}
                  />
                )}
              />
            </Switch>
          </div>
          {isCreator && (
            <RightMenu
              className="desktop"
              missionType={missionType}
              style={{
                width: '25rem',
                marginLeft: '5rem',
                marginTop: '3rem'
              }}
            />
          )}
        </div>
      </ErrorBoundary>
    ) : (
      <Loading />
    )
  ) : (
    <InvalidPage
      title="For Registered Users Only"
      text="Please Log In or Sign Up"
    />
  );
}
