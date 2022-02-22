import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Cover from './Cover';
import Body from './Body';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from '@emotion/css';
import { useAppContext, useProfileContext } from 'contexts';
import { useMyState, useProfileState } from 'helpers/hooks';
import InvalidPage from 'components/InvalidPage';
import Loading from 'components/Loading';

Profile.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default function Profile({ history, location, match }) {
  const loadProfileViaUsername = useAppContext(
    (v) => v.requestHelpers.loadProfileViaUsername
  );
  const setTheme = useAppContext((v) => v.requestHelpers.setTheme);
  const { userId, username } = useMyState();
  const onSetUserState = useAppContext((v) => v.user.actions.onSetUserState);
  const onSetProfileId = useProfileContext((v) => v.actions.onSetProfileId);
  const onUserNotExist = useProfileContext((v) => v.actions.onUserNotExist);
  const [selectedTheme, setSelectedTheme] = useState('logoBlue');
  const [loading, setLoading] = useState(false);
  const { notExist, profileId } = useProfileState(match.params.username);
  const profile = useAppContext((v) => v.user.state.userObj[profileId] || {});
  useEffect(() => {
    if (!notExist && !profile.loaded) {
      init();
    }
    async function init() {
      setLoading(true);
      try {
        const { pageNotExists, user } = await loadProfileViaUsername(
          match.params.username
        );
        if (pageNotExists) {
          setLoading(false);
          return onUserNotExist(match.params.username);
        }
        onSetProfileId({ username: match.params.username, profileId: user.id });
        onSetUserState({
          userId: user.id,
          newState: {
            userId: user.id,
            contentId: user.id,
            username: match.params.username,
            ...user,
            loaded: true
          }
        });
      } catch (error) {
        onUserNotExist(match.params.username);
      }
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.params.username, notExist, profile.loaded]);

  useEffect(() => {
    if (
      match.params.username === 'undefined' &&
      userId &&
      profile?.unavailable
    ) {
      history.push(`/${username}`);
    }
    setSelectedTheme(profile?.profileTheme || 'logoBlue');
  }, [
    history,
    match.params.username,
    profile?.profileTheme,
    profile?.unavailable,
    userId,
    username
  ]);

  return (
    <ErrorBoundary style={{ minHeight: '10rem' }}>
      {!notExist ? (
        <>
          {loading && (
            <Loading style={{ marginTop: '5rem' }} text="Loading Profile..." />
          )}
          {!loading && profile.id && (
            <div
              className={css`
                a {
                  white-space: pre-wrap;
                  overflow-wrap: break-word;
                  word-break: break-word;
                }
              `}
              style={{
                position: 'relative'
              }}
            >
              <Cover
                profile={profile}
                onSelectTheme={(theme) => {
                  setSelectedTheme(theme);
                }}
                selectedTheme={selectedTheme}
                onSetTheme={handleSetTheme}
              />
              <Body
                history={history}
                location={location}
                match={match}
                profile={profile}
                selectedTheme={selectedTheme}
              />
            </div>
          )}
        </>
      ) : (
        <InvalidPage
          title={!userId ? 'For Registered Users Only' : ''}
          text={!userId ? 'Please Log In or Sign Up' : ''}
        />
      )}
    </ErrorBoundary>
  );

  async function handleSetTheme() {
    await setTheme({ color: selectedTheme });
    onSetUserState({ userId, newState: { profileTheme: selectedTheme } });
  }
}
