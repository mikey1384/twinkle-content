import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import Main from './Main';
import RightMenu from './RightMenu';
import InvalidPage from 'components/InvalidPage';
import Management from './Management';
import FilterBar from 'components/FilterBar';
import { css } from 'emotion';
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
    params: { missionId }
  }
}) {
  const mounted = useRef(true);
  const history = useHistory();
  const location = useLocation();
  const { loaded, userId, canEdit } = useMyState();
  const {
    requestHelpers: { loadMission, updateCurrentMission }
  } = useAppContext();
  const {
    actions: { onUpdateCurrentMission }
  } = useContentContext();
  const {
    actions: { onLoadMission, onSetMissionState },
    state: { currentUserId, missionObj }
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
    if (!mission.loaded || (userId && currentUserId !== userId)) {
      init();
    }

    async function init() {
      if (userId) {
        const data = await loadMission(missionId);
        if (mounted.current) {
          onLoadMission({ ...data, currentUserId: userId });
        }
      } else {
        onLoadMission({ id: missionId, currentUserId: userId });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  return userId ? (
    loaded && mission.loaded ? (
      mission.id ? (
        <div style={{ width: '100%' }}>
          {canEdit && (
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
                  location.pathname === `/missions/${missionId}` ? 'active' : ''
                }
                onClick={() => history.push(`/missions/${missionId}`)}
              >
                Mission
              </nav>
              <nav
                className={
                  location.pathname === `/missions/${missionId}/manage`
                    ? 'active'
                    : ''
                }
                onClick={() => history.push(`/missions/${missionId}/manage`)}
              >
                Manage
              </nav>
            </FilterBar>
          )}
          <div
            className={css`
              padding-top: 1rem;
              @media (max-width: ${mobileMaxWidth}) {
                padding-top: ${canEdit ? '0.5rem' : 0};
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
                width: ${canEdit ? 'CALC(100% - 55rem)' : '60%'};
                ${canEdit
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
                  render={() => (
                    <Management
                      missionId={missionId}
                      mission={mission}
                      onSetMissionState={onSetMissionState}
                    />
                  )}
                />
              </Switch>
            </div>
            {canEdit && (
              <RightMenu
                className="desktop"
                missionId={missionId}
                style={{
                  width: '25rem',
                  marginLeft: '5rem',
                  marginTop: '3rem'
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <InvalidPage />
      )
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
