import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import FilterBar from 'components/FilterBar';
import ContentPanel from 'components/ContentPanel';
import Loading from 'components/Loading';
import SideMenu from './SideMenu';
import NotFound from 'components/NotFound';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';
import { isMobile } from 'helpers';
import {
  useInfiniteScroll,
  useProfileState,
  useScrollPosition
} from 'helpers/hooks';
import { useAppContext, useProfileContext, useViewContext } from 'contexts';

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
  const {
    requestHelpers: { loadFeeds }
  } = useAppContext();
  const {
    actions: { onLoadPosts, onLoadMorePosts }
  } = useProfileContext();
  const {
    posts: {
      [section]: profileFeeds,
      [`${section}LoadMoreButton`]: loadMoreButton,
      [`${section}Loaded`]: loaded
    }
  } = useProfileState(username);
  if (!profileFeeds) return <NotFound style={{ paddingTop: '13rem' }} />;

  const {
    actions: { onRecordScrollPosition },
    state: { scrollPositions }
  } = useViewContext();
  useScrollPosition({
    onRecordScrollPosition,
    pathname: location.pathname,
    scrollPositions,
    isMobile: isMobile(navigator)
  });
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
      {section !== 'likes' && (
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
        {loadingFeeds ? (
          <Loading
            className={css`
              margin-top: ${section === 'likes' ? '12rem' : '3rem'};
              width: ${section === 'likes' ? '55%' : '50%'};
              @media (max-width: ${mobileMaxWidth}) {
                width: 100%;
              }
            `}
            text="Loading..."
          />
        ) : (
          <div
            className={css`
              margin-top: 1rem;
              width: ${section === 'likes' ? '55%' : '50%'};
              @media (max-width: ${mobileMaxWidth}) {
                width: 100%;
              }
            `}
          >
            {profileFeeds.length > 0 &&
              profileFeeds.map((feed, index) => {
                const { contentId, contentType } = feed;
                return (
                  <ContentPanel
                    key={filterTable[section] + feed.feedId}
                    style={{
                      marginTop: index === 0 && '-1rem',
                      marginBottom: '1rem',
                      zIndex: profileFeeds.length - index
                    }}
                    zIndex={profileFeeds.length - index}
                    contentId={contentId}
                    contentType={contentType}
                    commentsLoadLimit={5}
                    numPreviewComments={1}
                  />
                );
              })}
            {profileFeeds.length === 0 && (
              <div
                style={{
                  marginTop: '6rem',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <div style={{ textAlign: 'center' }}>{onNoFeed(username)}</div>
              </div>
            )}
            {loadMoreButton && (
              <LoadMoreButton
                style={{ marginBottom: '1rem' }}
                onClick={handleLoadMoreFeeds}
                loading={loading}
                color="lightBlue"
                filled
              />
            )}
          </div>
        )}
        {section !== 'likes' && (
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

  function onNoFeed(username) {
    switch (section) {
      case 'all':
        return `${username} has not uploaded anything, yet`;
      case 'subjects':
        return `${username} has not uploaded a subject, yet`;
      case 'comments':
        return `${username} has not uploaded a comment, yet`;
      case 'links':
        return `${username} has not uploaded a link, yet`;
      case 'videos':
        return `${username} has not uploaded a video, yet`;
      case 'watched':
        return `${username} has not watched any XP video so far`;
      case 'likes':
        return `${username} doesn't like any content so far`;
    }
  }
}
