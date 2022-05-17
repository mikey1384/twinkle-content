import React from 'react';
import PropTypes from 'prop-types';
import { Color, mobileMaxWidth } from 'constants/css';
import FilterBar from 'components/FilterBar';
import Home from './Home';
import Posts from './Posts';
import {
  Routes,
  Route,
  useParams,
  useMatch,
  useLocation,
  useNavigate
} from 'react-router-dom';
import { css } from '@emotion/css';
import localize from 'constants/localize';

const profileLabel = localize('Profile');
const watchedLabel = localize('watched');
const likesLabel = localize('likes');
const postsLabel = localize('posts');

Body.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.number.isRequired,
    username: PropTypes.string
  }),
  selectedTheme: PropTypes.string
};

export default function Body({ profile, selectedTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const match = useMatch();
  const { username } = useParams();
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
            onClick={() => navigate(`/users/${username}`)}
          >
            <a>{profileLabel}</a>
          </nav>
          <nav
            className={
              location.pathname === `/users/${username}/watched` ? 'active' : ''
            }
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/users/${username}/watched`)}
          >
            <a>{watchedLabel}</a>
          </nav>
          <nav
            className={
              location.pathname === `/users/${username}/likes` ? 'active' : ''
            }
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/users/${username}/likes`)}
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
            onClick={() => navigate(`/users/${username}/all`)}
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
          <Routes>
            <Route
              exact
              path={`${match.path}`}
              element={<Home profile={profile} selectedTheme={selectedTheme} />}
            />
            <Route
              path={`${match.path}/:section`}
              element={
                <Posts
                  username={profile.username}
                  selectedTheme={selectedTheme}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
