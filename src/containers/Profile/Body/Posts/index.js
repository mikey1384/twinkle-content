import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import FilterBar from 'components/FilterBar';
import Loading from 'components/Loading';
import SideMenu from '../SideMenu';
import InvalidPage from 'components/InvalidPage';
import Feeds from './Feeds';
import { css } from '@emotion/css';
import { mobileMaxWidth } from 'constants/css';
import { useInfiniteScroll, useProfileState } from 'helpers/hooks';
import { useAppContext, useProfileContext } from 'contexts';

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
    params: { section, username }
  },
  selectedTheme
}) {
  const loadFeeds = useAppContext((v) => v.requestHelpers.loadFeeds);
  const onLoadPosts = useProfileContext((v) => v.actions.onLoadPosts);
  const onLoadMorePosts = useProfileContext((v) => v.actions.onLoadMorePosts);
  const {
    posts: {
      [section]: profileFeeds,
      [`${section}LoadMoreButton`]: loadMoreButton,
      [`${section}Loaded`]: loaded
    }
  } = useProfileState(username);
  if (!profileFeeds) return <InvalidPage style={{ paddingTop: '13rem' }} />;

  const [loading, setLoading] = useState(false);
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const mounted = useRef(true);
  const selectedFilter = useRef('all');
  useInfiniteScroll({
    feedsLength: profileFeeds.length,
    scrollable: profileFeeds.length > 0,
    loadable: loadMoreButton,
    loading,
    onScrollToBottom: () => setLoading(true),
    onLoad: handleLoadMoreFeeds
  });

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (profileFeeds.length === 0) {
      handleLoadTab(section);
    }

    async function handleLoadTab(tabName) {
      selectedFilter.current = filterTable[tabName];
      setLoadingFeeds(true);
      const { data, filter: loadedFilter } = await loadFeeds({
        username,
        filter: filterTable[tabName]
      });
      if (loadedFilter === selectedFilter.current) {
        onLoadPosts({ ...data, section: tabName, username });
        setLoadingFeeds(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, profileFeeds.length, section, username]);

  return !loaded ? (
    <Loading style={{ marginBottom: '50vh' }} text="Loading..." />
  ) : (
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
        <Feeds
          feeds={profileFeeds}
          filterTable={filterTable}
          loading={loadingFeeds}
          loadMoreButton={loadMoreButton}
          onLoadMoreFeeds={handleLoadMoreFeeds}
          section={section}
          username={username}
        />
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

  async function handleLoadMoreFeeds() {
    try {
      const { data } = await loadFeeds({
        username,
        filter: filterTable[section],
        lastFeedId:
          profileFeeds.length > 0
            ? profileFeeds[profileFeeds.length - 1].feedId
            : null,
        lastTimeStamp:
          profileFeeds.length > 0
            ? profileFeeds[profileFeeds.length - 1][
                section === 'watched' ? 'viewTimeStamp' : 'lastInteraction'
              ]
            : null
      });
      onLoadMorePosts({ ...data, section, username });
      if (mounted.current) {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function onClickPostsMenu({ item }) {
    history.push(
      `/users/${username}/${item === 'url' ? 'link' : item}${
        item === 'all' ? '' : 's'
      }`
    );
  }
}
