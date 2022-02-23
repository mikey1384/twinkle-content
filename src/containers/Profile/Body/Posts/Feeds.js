import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import ContentPanel from 'components/ContentPanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import FilterBar from 'components/FilterBar';
import Loading from 'components/Loading';
import { useInfiniteScroll } from 'helpers/hooks';
import { useAppContext, useProfileContext } from 'contexts';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

Feeds.propTypes = {
  feeds: PropTypes.array.isRequired,
  filterTable: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loaded: PropTypes.bool,
  loadMoreButton: PropTypes.bool,
  location: PropTypes.object.isRequired,
  match: PropTypes.object,
  section: PropTypes.string.isRequired,
  selectedTheme: PropTypes.string,
  username: PropTypes.string.isRequired
};

export default function Feeds({
  feeds,
  filterTable,
  history,
  loaded,
  loadMoreButton,
  location,
  match,
  section,
  selectedTheme,
  username
}) {
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const selectedFilter = useRef('all');
  const mounted = useRef(true);
  const loadFeeds = useAppContext((v) => v.requestHelpers.loadFeeds);
  const onLoadPosts = useProfileContext((v) => v.actions.onLoadPosts);
  const onLoadMorePosts = useProfileContext((v) => v.actions.onLoadMorePosts);

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useInfiniteScroll({
    feedsLength: feeds.length,
    scrollable: feeds.length > 0,
    loadable: loadMoreButton,
    loading: loadingMore,
    onScrollToBottom: () => setLoadingMore(true),
    onLoad: handleLoadMoreFeeds
  });

  useEffect(() => {
    if (feeds.length === 0) {
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
  }, [location.pathname, feeds.length, section, username]);

  const filterBarShown = useMemo(
    () => ['all', 'subjects', 'links', 'videos'].includes(section),
    [section]
  );
  useEffect(() => {
    if (match?.params?.filter && match?.params?.filter !== 'byuser') {
      return history.push(`/users/${username}/${section}`);
    }
    if (match?.params?.filter === 'byuser' && !filterBarShown) {
      return history.push(`/users/${username}/${section}`);
    }
  }, [filterBarShown, history, match?.params?.filter, section, username]);
  const noFeedLabel = useMemo(() => {
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
        return `${username} has not liked any content so far`;
    }
  }, [section, username]);

  return (
    <ErrorBoundary>
      <div
        className={css`
          margin-top: 1rem;
          width: ${['likes', 'watched'].includes(section) ? '55%' : '50%'};
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
      >
        {filterBarShown && (
          <FilterBar
            bordered
            color={selectedTheme}
            style={{
              height: '5rem',
              marginTop: '-1rem',
              marginBottom: '2rem'
            }}
          >
            <nav
              className={match?.params?.filter === 'byuser' ? '' : 'active'}
              onClick={() => history.push(`/users/${username}/${section}`)}
            >
              All
            </nav>
            <nav
              className={match?.params?.filter === 'byuser' ? 'active' : ''}
              onClick={() =>
                history.push(`/users/${username}/${section}/byuser`)
              }
            >
              Made by {username}
            </nav>
          </FilterBar>
        )}
        {!loaded || loadingFeeds ? (
          <Loading
            className={css`
              margin-top: ${['likes', 'watched'].includes(section)
                ? '12rem'
                : '8rem'};
              width: 100%;
            `}
            text="Loading..."
          />
        ) : (
          <>
            {feeds.length > 0 &&
              feeds.map((feed, index) => {
                const { contentId, contentType } = feed;
                return (
                  <ContentPanel
                    key={filterTable[section] + feed.feedId}
                    style={{
                      marginTop: index === 0 && '-1rem',
                      marginBottom: '1rem',
                      zIndex: feeds.length - index
                    }}
                    zIndex={feeds.length - index}
                    contentId={contentId}
                    contentType={contentType}
                    commentsLoadLimit={5}
                    numPreviewComments={1}
                  />
                );
              })}
            {feeds.length === 0 && (
              <div
                style={{
                  marginTop: '7rem',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <div style={{ textAlign: 'center' }}>{noFeedLabel}</div>
              </div>
            )}
          </>
        )}
        {loadMoreButton && (
          <LoadMoreButton
            style={{ marginBottom: '1rem' }}
            onClick={handleLoadMoreFeeds}
            loading={loadingMore}
            color="lightBlue"
            filled
          />
        )}
        <div
          className={css`
            display: ${loadMoreButton ? 'none' : 'block'};
            height: 7rem;
            @media (max-width: ${mobileMaxWidth}) {
              display: block;
            }
          `}
        />
      </div>
    </ErrorBoundary>
  );

  async function handleLoadMoreFeeds() {
    try {
      const { data } = await loadFeeds({
        username,
        filter: filterTable[section],
        lastFeedId: feeds.length > 0 ? feeds[feeds.length - 1].feedId : null,
        lastTimeStamp:
          feeds.length > 0
            ? feeds[feeds.length - 1][
                section === 'watched' ? 'viewTimeStamp' : 'lastInteraction'
              ]
            : null
      });
      onLoadMorePosts({ ...data, section, username });
      if (mounted.current) {
        setLoadingMore(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
