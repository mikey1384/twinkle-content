import React from 'react';
import PropTypes from 'prop-types';
import FilterBar from 'components/FilterBar';
import SideMenu from '../SideMenu';
import InvalidPage from 'components/InvalidPage';
import Feeds from './Feeds';
import { Route, Switch } from 'react-router-dom';
import { css } from '@emotion/css';
import { mobileMaxWidth } from 'constants/css';
import { useProfileState } from 'helpers/hooks';

Posts.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  selectedTheme: PropTypes.string
};

const filterTable = {
  all: 'all',
  comments: 'comment',
  likes: 'like',
  watched: 'watched',
  subjects: 'subject',
  videos: 'video',
  links: 'url'
};

export default function Posts({
  history,
  location,
  match: {
    path,
    params: { section, username }
  },
  selectedTheme
}) {
  const {
    posts: {
      [section]: profileFeeds,
      [section + 'ByUser']: byUserFeeds = [],
      [`${section}LoadMoreButton`]: loadMoreButton,
      [`${section}ByUserLoadMoreButton`]: byUserLoadMoreButton,
      [`${section}Loaded`]: loaded,
      [`${section}ByUserLoaded`]: byUserloaded
    }
  } = useProfileState(username);
  if (!profileFeeds) return <InvalidPage style={{ paddingTop: '13rem' }} />;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
      {!['likes', 'watched'].includes(section) && (
        <FilterBar
          color={selectedTheme}
          style={{ height: '5rem', marginTop: '-1rem' }}
          className={`mobile ${css`
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.3rem;
            }
          `}`}
        >
          {[
            { key: 'all', label: 'All' },
            { key: 'subject', label: 'Subjects' },
            { key: 'video', label: 'Videos' },
            { key: 'url', label: 'Links' }
          ].map((type) => {
            return (
              <nav
                key={type.key}
                className={filterTable[section] === type.key ? 'active' : ''}
                onClick={() => onClickPostsMenu({ item: type.key })}
              >
                {type.label}
              </nav>
            );
          })}
        </FilterBar>
      )}
      <div
        className={css`
          width: 100%;
          display: flex;
          justify-content: center;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100vw;
          }
        `}
      >
        <Switch>
          <Route
            exact
            path={path}
            render={({ match }) => (
              <Feeds
                location={location}
                match={match}
                feeds={profileFeeds}
                filterTable={filterTable}
                history={history}
                loaded={loaded}
                loadMoreButton={loadMoreButton}
                section={section}
                selectedTheme={selectedTheme}
                username={username}
              />
            )}
          />
          <Route
            path={`${path}/:filter`}
            render={({ match }) => (
              <Feeds
                location={location}
                match={match}
                feeds={byUserFeeds}
                filterTable={filterTable}
                history={history}
                loaded={byUserloaded}
                loadMoreButton={byUserLoadMoreButton}
                section={section}
                selectedTheme={selectedTheme}
                username={username}
              />
            )}
          />
        </Switch>
        {!['likes', 'watched'].includes(section) && (
          <SideMenu
            className={`desktop ${css`
              width: 10%;
            `}`}
            menuItems={[
              { key: 'all', label: 'All' },
              { key: 'comment', label: 'Comments' },
              { key: 'subject', label: 'Subjects' },
              { key: 'video', label: 'Videos' },
              { key: 'url', label: 'Links' }
            ]}
            onMenuClick={onClickPostsMenu}
            selectedKey={filterTable[section]}
          />
        )}
      </div>
    </div>
  );

  function onClickPostsMenu({ item }) {
    history.push(
      `/users/${username}/${item === 'url' ? 'link' : item}${
        item === 'all' ? '' : 's'
      }`
    );
  }
}
