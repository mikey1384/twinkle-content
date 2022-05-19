import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import MainFeeds from './MainFeeds';
import ChatFeeds from './ChatFeeds';
import ErrorBoundary from 'components/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import Loading from 'components/Loading';
import { container } from './Styles';
import { defaultChatSubject } from 'constants/defaultValues';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useNotiContext, useViewContext } from 'contexts';
import { isMobile } from 'helpers';
import localize from 'constants/localize';

const deviceIsMobile = isMobile(navigator);
const newsLabel = localize('news');
const rankingsLabel = localize('rankings');

Notification.propTypes = {
  className: PropTypes.string,
  location: PropTypes.string,
  style: PropTypes.object,
  trackScrollPosition: PropTypes.bool
};

function Notification({ className, location, style, trackScrollPosition }) {
  const ContainerRef = useRef(null);
  const loadRankings = useAppContext((v) => v.requestHelpers.loadRankings);
  const fetchNotifications = useAppContext(
    (v) => v.requestHelpers.fetchNotifications
  );
  const loadRewards = useAppContext((v) => v.requestHelpers.loadRewards);
  const { userId } = useMyState();
  const loadMoreRewards = useNotiContext((v) => v.state.loadMoreRewards);
  const notiObj = useNotiContext((v) => v.state.notiObj);
  const notificationsLoaded = useNotiContext(
    (v) => v.state.notificationsLoaded
  );
  const rankingsLoaded = useNotiContext((v) => v.state.rankingsLoaded);
  const numNewNotis = useNotiContext((v) => v.state.numNewNotis);
  const rewards = useNotiContext((v) => v.state.rewards);
  const totalRewardedTwinkles = useNotiContext(
    (v) => v.state.totalRewardedTwinkles
  );
  const totalRewardedTwinkleCoins = useNotiContext(
    (v) => v.state.totalRewardedTwinkleCoins
  );
  const {
    content = defaultChatSubject,
    loaded,
    ...subject
  } = useNotiContext((v) => v.state.currentChatSubject);
  const onLoadNotifications = useNotiContext(
    (v) => v.actions.onLoadNotifications
  );
  const onLoadRewards = useNotiContext((v) => v.actions.onLoadRewards);
  const onGetRanks = useNotiContext((v) => v.actions.onGetRanks);
  const onResetRewards = useNotiContext((v) => v.actions.onResetRewards);
  const scrollPositions = useViewContext((v) => v.state.scrollPositions);
  const onRecordScrollPosition = useViewContext(
    (v) => v.actions.onRecordScrollPosition
  );

  const loadingNotificationRef = useRef(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('rankings');
  const userChangedTab = useRef(false);
  const mounted = useRef(true);
  const notifications = useMemo(
    () => notiObj[userId]?.notifications || [],
    [userId, notiObj]
  );
  const loadMoreNotifications = useMemo(
    () => notiObj[userId]?.loadMore || false,
    [userId, notiObj]
  );

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      onResetRewards();
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userChangedTab.current) {
      const tab =
        activeTab === 'reward' ||
        totalRewardedTwinkles + totalRewardedTwinkleCoins > 0
          ? 'reward'
          : (activeTab === 'notification' && notifications.length > 0) ||
            (location === 'home' && notifications.length > 0) ||
            numNewNotis > 0
          ? 'notification'
          : 'rankings';
      setActiveTab(tab);
    }
  }, [
    userId,
    notifications,
    rewards.length,
    activeTab,
    totalRewardedTwinkles,
    totalRewardedTwinkleCoins,
    location,
    numNewNotis
  ]);

  useEffect(() => {
    if (!userId) {
      fetchRankings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    userChangedTab.current = false;
    onResetRewards();
    if (activeTab === 'reward') {
      setActiveTab('notification');
    }
    if (!userId) {
      setActiveTab('rankings');
    }
    handleFetchNotifications(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (rankingsLoaded && !notificationsLoaded) {
      fetchNews();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      trackScrollPosition &&
      !deviceIsMobile &&
      scrollPositions?.[`notification-${location}`] &&
      activeTab === 'notification'
    ) {
      setTimeout(() => {
        ContainerRef.current.scrollTop =
          scrollPositions[`notification-${location}`];
      }, 10);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const rewardTabShown = useMemo(() => {
    return (
      (!loadingNotifications || activeTab === 'reward') && rewards.length > 0
    );
  }, [activeTab, loadingNotifications, rewards.length]);

  return (
    <ErrorBoundary>
      <div
        ref={ContainerRef}
        onScroll={handleScroll}
        style={style}
        className={`${container} ${className}`}
      >
        <section
          style={{
            marginBottom: '1rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {loaded && location === 'home' && (
            <ChatFeeds
              myId={userId}
              content={content}
              style={{
                marginBottom: '1rem'
              }}
              {...subject}
            />
          )}
          {userId && (numNewNotis > 0 || notifications.length > 0) && (
            <FilterBar
              bordered
              style={{
                fontSize: '1.6rem',
                height: '5rem',
                marginBottom:
                  loadingNotifications && activeTab === 'reward' ? 0 : null
              }}
            >
              <nav
                className={`${activeTab === 'notification' && 'active'} ${
                  numNewNotis > 0 && 'alert'
                }`}
                onClick={() => {
                  userChangedTab.current = true;
                  setActiveTab('notification');
                }}
              >
                {newsLabel}
              </nav>
              <nav
                className={activeTab === 'rankings' ? 'active' : undefined}
                onClick={() => {
                  userChangedTab.current = true;
                  setActiveTab('rankings');
                }}
              >
                {rankingsLabel}
              </nav>
              {rewardTabShown && (
                <nav
                  className={`${activeTab === 'reward' && 'active'} ${
                    totalRewardedTwinkles + totalRewardedTwinkleCoins > 0 &&
                    'alert'
                  }`}
                  onClick={() => {
                    userChangedTab.current = true;
                    setActiveTab('reward');
                  }}
                >
                  Rewards
                </nav>
              )}
            </FilterBar>
          )}
          <div style={{ position: 'relative' }}>
            <MainFeeds
              loadingNotifications={loadingNotifications}
              loadMoreRewardsButton={loadMoreRewards}
              loadMoreNotificationsButton={loadMoreNotifications}
              activeTab={activeTab}
              notifications={notifications}
              rewards={rewards}
              selectNotiTab={() => {
                userChangedTab.current = true;
                setActiveTab('notification');
              }}
            />
          </div>
        </section>
        {loadingNotifications && (
          <Loading
            style={{
              position: 'absolute',
              height: 0,
              top: '16rem',
              zIndex: 1000
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );

  async function handleFetchNotifications(userId) {
    await fetchRankings();
    if (notifications.length === 0 && userId) {
      fetchNews(userId);
    }
  }

  async function fetchNews() {
    if (!loadingNotificationRef.current) {
      setLoadingNotifications(true);
      loadingNotificationRef.current = true;
      const [
        { currentChatSubject, loadMoreNotifications, notifications },
        {
          rewards,
          loadMoreRewards,
          totalRewardedTwinkles,
          totalRewardedTwinkleCoins
        }
      ] = await Promise.all([fetchNotifications(), loadRewards()]);
      if (mounted.current) {
        onLoadRewards({
          rewards,
          loadMoreRewards,
          totalRewardedTwinkles,
          totalRewardedTwinkleCoins
        });
      }
      if (mounted.current) {
        onLoadNotifications({
          currentChatSubject,
          loadMoreNotifications,
          notifications,
          userId
        });
      }
      if (mounted.current) {
        setLoadingNotifications(false);
      }
      loadingNotificationRef.current = false;
    }
  }
  async function fetchRankings() {
    const {
      all,
      top30s,
      allMonthly,
      top30sMonthly,
      myMonthlyRank,
      myAllTimeRank,
      myAllTimeXP,
      myMonthlyXP
    } = await loadRankings();

    if (mounted.current) {
      onGetRanks({
        all,
        top30s,
        allMonthly,
        top30sMonthly,
        myMonthlyRank,
        myAllTimeRank,
        myAllTimeXP,
        myMonthlyXP
      });
    }
    return Promise.resolve();
  }

  function handleScroll(event) {
    if (!trackScrollPosition || activeTab !== 'notification') return;
    onRecordScrollPosition({
      section: `notification-${location}`,
      position: event.target.scrollTop
    });
  }
}

export default memo(Notification);
