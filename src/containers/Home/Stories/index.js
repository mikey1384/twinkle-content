import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import InputPanel from './InputPanel';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Loading from 'components/Loading';
import Banner from 'components/Banner';
import ErrorBoundary from 'components/ErrorBoundary';
import HomeFilter from './HomeFilter';
import ContentPanel from 'components/ContentPanel';
import { isMobile } from 'helpers';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';
import {
  useInfiniteScroll,
  useMyState,
  useScrollPosition
} from 'helpers/hooks';
import {
  useAppContext,
  useHomeContext,
  useViewContext,
  useNotiContext
} from 'contexts';

const categoryObj = {
  uploads: {
    filter: 'subject',
    orderBy: 'lastInteraction'
  },
  recommended: {
    filter: 'all',
    mustInclude: 'totalRecommendations',
    orderBy: 'lastInteraction'
  },
  responses: {
    filter: 'comment',
    orderBy: 'totalRewards'
  },
  videos: {
    filter: 'video',
    orderBy: 'totalViewDuration'
  }
};

Stories.propTypes = {
  location: PropTypes.object
};

export default function Stories({ location }) {
  const {
    requestHelpers: { loadFeeds, loadNewFeeds }
  } = useAppContext();
  const { hideWatched, userId, username } = useMyState();
  const {
    state: { numNewPosts },
    actions: { onResetNumNewPosts }
  } = useNotiContext();
  const {
    state: {
      category,
      displayOrder,
      feeds,
      loadMoreButton,
      loaded,
      feedsOutdated,
      subFilter
    },
    actions: {
      onChangeCategory,
      onChangeSubFilter,
      onLoadFeeds,
      onLoadMoreFeeds,
      onLoadNewFeeds,
      onSetDisplayOrder
    }
  } = useHomeContext();

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

  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingNewFeeds, setLoadingNewFeeds] = useState(false);
  const mounted = useRef(true);
  const categoryRef = useRef(null);
  const ContainerRef = useRef(null);
  const hideWatchedRef = useRef(null);

  useInfiniteScroll({
    scrollable: feeds.length > 0,
    feedsLength: feeds.length,
    loadable: loadMoreButton,
    loading: loadingMore,
    onScrollToBottom: () => setLoadingMore(true),
    onLoad: handleLoadMoreFeeds
  });

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      category === 'videos' &&
      loaded &&
      typeof hideWatchedRef.current === 'number' &&
      hideWatchedRef.current !== hideWatched
    ) {
      filterVideos();
    }
    async function filterVideos() {
      const { data } = await loadFeeds({
        order: 'desc',
        filter: categoryObj.videos.filter,
        orderBy: categoryObj.videos.orderBy
      });
      if (category === 'videos' && mounted.current) {
        onLoadFeeds(data);
      }
    }
    hideWatchedRef.current = hideWatched;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hideWatched]);

  useEffect(() => {
    if (!loaded) {
      handleLoadFeeds();
    }

    async function handleLoadFeeds() {
      setLoadingFeeds(true);
      categoryRef.current = 'uploads';
      onChangeCategory('recommended');
      onChangeSubFilter('all');
      onResetNumNewPosts();
      try {
        const { data } = await loadFeeds({
          mustInclude: 'totalRecommendations'
        });
        onLoadFeeds(data);
        setLoadingFeeds(false);
      } catch (error) {
        console.error(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const ContentPanels = useMemo(() => {
    return feeds.map((feed, index) => (
      <ContentPanel
        key={category + subFilter + feed.contentId + feed.contentType}
        style={{
          marginBottom: '1rem'
        }}
        zIndex={feeds.length - index}
        contentId={feed.contentId}
        contentType={feed.contentType}
        commentsLoadLimit={5}
        numPreviewComments={1}
        userId={userId}
      />
    ));
  }, [category, feeds, subFilter, userId]);

  return (
    <ErrorBoundary>
      <div style={{ width: '100%' }} ref={ContainerRef}>
        <HomeFilter
          category={category}
          changeCategory={handleChangeCategory}
          displayOrder={displayOrder}
          selectedFilter={subFilter}
          applyFilter={applyFilter}
          setDisplayOrder={handleDisplayOrder}
        />
        <InputPanel />
        <div style={{ width: '100%' }}>
          {loadingFeeds && <Loading text="Loading Feeds..." />}
          {loaded && feeds.length === 0 && !loadingFeeds && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '15rem'
              }}
            >
              <h1 style={{ textAlign: 'center' }}>
                {username
                  ? `Hello ${username}, be the first to post something`
                  : 'Hi there!'}
              </h1>
            </div>
          )}
          {loaded && !loadingFeeds && feeds.length > 0 && (
            <>
              {feedsOutdated && (
                <Banner
                  color="gold"
                  onClick={() => window.location.reload()}
                  style={{ marginBottom: '1rem' }}
                >
                  Tap to See New Posts!
                </Banner>
              )}
              {numNewPosts > 0 && !feedsOutdated && (
                <Banner
                  color="gold"
                  onClick={handleFetchNewFeeds}
                  style={{ marginBottom: '1rem' }}
                >
                  Tap to See {numNewPosts} new Post
                  {numNewPosts > 1 ? 's' : ''}
                </Banner>
              )}
              {ContentPanels}
              {loadMoreButton && (
                <LoadMoreButton
                  style={{ marginBottom: '1rem' }}
                  onClick={() => setLoadingMore(true)}
                  loading={loadingMore}
                  color="lightBlue"
                  filled
                />
              )}
              <div
                className={css`
                  display: none;
                  @media (max-width: ${mobileMaxWidth}) {
                    display: block;
                    height: 5rem;
                  }
                `}
              />
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );

  async function applyFilter(filter) {
    if (filter === subFilter) return;
    setLoadingFeeds(true);
    categoryRef.current = 'uploads';
    onChangeCategory('uploads');
    onChangeSubFilter(filter);
    const { data, filter: newFilter } = await loadFeeds({ filter });
    if (
      filter === newFilter &&
      categoryRef.current === 'uploads' &&
      mounted.current
    ) {
      onLoadFeeds(data);
      onSetDisplayOrder('desc');
      setLoadingFeeds(false);
    }
  }

  async function handleLoadMoreFeeds() {
    try {
      const { data } = await loadFeeds({
        filter:
          category === 'uploads' ? subFilter : categoryObj[category].filter,
        order: displayOrder,
        orderBy: categoryObj[category].orderBy,
        mustInclude: categoryObj[category].mustInclude,
        lastFeedId: feeds.length > 0 ? feeds[feeds.length - 1].feedId : null,
        lastRewardLevel:
          feeds.length > 0 ? feeds[feeds.length - 1].rewardLevel : null,
        lastTimeStamp:
          feeds.length > 0 ? feeds[feeds.length - 1].lastInteraction : null,
        lastViewDuration:
          feeds.length > 0 ? feeds[feeds.length - 1].totalViewDuration : null
      });
      if (mounted.current) {
        onLoadMoreFeeds(data);
        setLoadingMore(false);
      }
    } catch (error) {
      console.error(error);
      setLoadingMore(false);
    }
  }

  async function handleChangeCategory(newCategory) {
    categoryRef.current = newCategory;
    setLoadingFeeds(true);
    onChangeCategory(newCategory);
    onChangeSubFilter(categoryObj[newCategory].filter);
    const { filter: loadedFilter, data } = await loadFeeds({
      order: 'desc',
      filter: categoryObj[newCategory].filter,
      orderBy: categoryObj[newCategory].orderBy,
      mustInclude: categoryObj[newCategory].mustInclude
    });
    if (mounted.current) {
      if (
        loadedFilter === categoryObj[categoryRef.current].filter &&
        categoryRef.current === newCategory
      ) {
        onLoadFeeds(data);
        onSetDisplayOrder('desc');
        setLoadingFeeds(false);
      }
    }
  }

  async function handleFetchNewFeeds() {
    onChangeSubFilter('all');
    if (
      category !== 'uploads' ||
      displayOrder === 'asc' ||
      (category === 'uploads' && subFilter === 'subject')
    ) {
      onResetNumNewPosts();
      categoryRef.current = 'uploads';
      onChangeCategory('uploads');
      const { data } = await loadFeeds();
      if (categoryRef.current === 'uploads' && mounted.current) {
        onLoadFeeds(data);
      }
      return;
    }
    if (!loadingNewFeeds) {
      setLoadingNewFeeds(true);
      onResetNumNewPosts();
      const data = await loadNewFeeds({
        lastInteraction: feeds[0] ? feeds[0].lastInteraction : 0
      });
      if (data && mounted.current) onLoadNewFeeds(data);
      setLoadingNewFeeds(false);
    }
  }

  async function handleDisplayOrder() {
    const newDisplayOrder = displayOrder === 'desc' ? 'asc' : 'desc';
    const initialFilter =
      category === 'uploads' ? subFilter : categoryObj[category].filter;
    setLoadingFeeds(true);
    const { data, filter } = await loadFeeds({
      order: newDisplayOrder,
      orderBy: categoryObj[category].orderBy,
      filter: initialFilter
    });
    if (filter === initialFilter && mounted.current) {
      onLoadFeeds(data);
      onSetDisplayOrder(newDisplayOrder);
      setLoadingFeeds(false);
    }
  }
}
