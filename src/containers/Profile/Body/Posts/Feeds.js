import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import ContentPanel from 'components/ContentPanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import FilterBar from 'components/FilterBar';
import Loading from 'components/Loading';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

Feeds.propTypes = {
  feeds: PropTypes.array.isRequired,
  filterTable: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  loadMoreButton: PropTypes.bool,
  match: PropTypes.object,
  onLoadMoreFeeds: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  selectedTheme: PropTypes.string,
  username: PropTypes.string.isRequired
};

export default function Feeds({
  feeds,
  filterTable,
  history,
  loading,
  loadMoreButton,
  match,
  onLoadMoreFeeds,
  section,
  selectedTheme,
  username
}) {
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
      {loading ? (
        <Loading
          className={css`
            margin-top: ${['likes', 'watched'].includes(section)
              ? '12rem'
              : '3rem'};
            width: ${['likes', 'watched'].includes(section) ? '55%' : '50%'};
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
              className={css`
                font-size: 1.6rem;
                @media (max-width: ${mobileMaxWidth}) {
                  font-size: 1.3rem;
                }
              `}
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
          {loadMoreButton && (
            <LoadMoreButton
              style={{ marginBottom: '1rem' }}
              onClick={onLoadMoreFeeds}
              loading={loading}
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
      )}
    </ErrorBoundary>
  );
}
