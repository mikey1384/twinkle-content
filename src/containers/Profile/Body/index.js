import React from 'react';
import PropTypes from 'prop-types';
import { Color, mobileMaxWidth } from 'constants/css';
import FilterBar from 'components/FilterBar';
import Home from './Home';
import Posts from './Posts';
import { Switch, Route } from 'react-router-dom';
import { css } from '@emotion/css';
import localize from 'constants/localize';

const profileLabel = localize('Profile');
const watchedLabel = localize('watched');
const likesLabel = localize('likes');
const postsLabel = localize('posts');

Body.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  profile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string
  }),
  selectedTheme: PropTypes.string
};

export default function Body({
  history,
  location,
  match,
  match: {
    params: { username }
  },
  profile,
  selectedTheme
}) {
  return (
    <div
      className={css`
        width: 100%;
        @media (max-width: ${mobileMaxWidth}) {
          width: 100%;
        }
      `}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <div
          className={css`
            width: 40%;
            background: #fff;
            border-bottom: 1px solid ${Color.borderGray()};
            @media (max-width: ${mobileMaxWidth}) {
              width: 20rem;
            }
          `}
        />
        <FilterBar
          style={{ margin: 0 }}
          color={selectedTheme}
          className={css`
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.3rem;
            }
          `}
        >
          <nav
            className={
              location.pathname === `/users/${username}` ? 'active' : ''
            }
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(`/users/${username}`)}
          >
            <a>{profileLabel}</a>
          </nav>
          <nav
            className={
              location.pathname === `/users/${username}/watched` ? 'active' : ''
            }
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(`/users/${username}/watched`)}
          >
            <a>{watchedLabel}</a>
          </nav>
          <nav
            className={
              location.pathname === `/users/${username}/likes` ? 'active' : ''
            }
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(`/users/${username}/likes`)}
          >
            <a>{likesLabel}</a>
          </nav>
          <nav
            className={
              location.pathname !== `/users/${username}` &&
              location.pathname !== `/users/${username}/likes` &&
              location.pathname !== `/users/${username}/watched`
                ? 'active'
                : ''
            }
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(`/users/${username}/all`)}
          >
            <a>{postsLabel}</a>
          </nav>
        </FilterBar>
        <div
          className={css`
            width: 35rem;
            background: #fff;
            border-bottom: 1px solid ${Color.borderGray()};
            @media (max-width: ${mobileMaxWidth}) {
              width: 0;
            }
          `}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div
          className={css`
            display: flex;
            margin: 1rem 1rem 0 1rem;
            width: 100%;
            justify-content: center;
            @media (max-width: ${mobileMaxWidth}) {
              margin-top: 1rem;
            }
          `}
        >
          <Switch>
            <Route
              exact
              path={`${match.path}`}
              render={() => (
                <Home
                  location={location}
                  profile={profile}
                  selectedTheme={selectedTheme}
                />
              )}
            />
            <Route
              path={`${match.path}/:section`}
              render={({ match }) => (
                <Posts
                  history={history}
                  match={match}
                  username={profile.username}
                  location={location}
                  selectedTheme={selectedTheme}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
}
