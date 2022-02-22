import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import ContentPanel from 'components/ContentPanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

Feeds.propTypes = {
  feeds: PropTypes.array.isRequired,
  filterTable: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  loadMoreButton: PropTypes.bool,
  onLoadMoreFeeds: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired
};

export default function Feeds({
  feeds,
  filterTable,
  loading,
  loadMoreButton,
  onLoadMoreFeeds,
  section,
  username
}) {
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
                marginTop: '6rem',
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
