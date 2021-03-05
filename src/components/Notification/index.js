import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import MainFeeds from './MainFeeds';
import ChatFeeds from './ChatFeeds';
import ErrorBoundary from 'components/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import Loading from 'components/Loading';
import { container } from './Styles';
import { defaultChatSubject } from 'constants/defaultValues';
import { socket } from 'constants/io';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useNotiContext } from 'contexts';

Notification.propTypes = {
  className: PropTypes.string,
  location: PropTypes.string,
  style: PropTypes.object
};

function Notification({ className, location, style }) {
  const {
    requestHelpers: { loadRankings, fetchNotifications }
  } = useAppContext();
  const { userId, twinkleXP } = useMyState();
  const {
    state: {
      loadMore,
      notifications,
      numNewNotis,
      rewards,
      totalRewardedTwinkles,
      totalRewardedTwinkleCoins,
      currentChatSubject: { content = defaultChatSubject, loaded, ...subject }
    },
    actions: {
      onClearNotifications,
      onFetchNotifications,
      onGetRanks,
      onResetRewards
    }
  } = useNotiContext();
  const loadingNotificationRef = useRef(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState('rankings');
  const userChangedTab = useRef(false);
  const mounted = useRef(true);
  const prevUserId = useRef(userId);
  const prevTwinkleXP = useRef(twinkleXP);

  useEffect(() => {
    return function cleanUp() {
      onResetRewards();
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    onResetRewards();
    userChangedTab.current = false;
    handleFetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!userChangedTab.current) {
      if (!userId) {
        setActiveTab('rankings');
      } else {
        const tab =
          activeTab === 'reward' ||
          totalRewardedTwinkles + totalRewardedTwinkleCoins > 0
            ? 'reward'
            : activeTab === 'notification' ||
              (location === 'home' && notifications.length > 0) ||
              numNewNotis > 0
            ? 'notification'
            : 'rankings';
        setActiveTab(tab);
      }
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
    if (userId !== prevUserId.current && !!prevUserId.current) {
      onClearNotifications();
      handleFetchNotifications(true);
    }
    prevUserId.current = userId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (
      typeof twinkleXP === 'number' &&
      twinkleXP > (prevTwinkleXP.current || 0)
    ) {
      fetchRankings();
    }
    prevTwinkleXP.current = twinkleXP;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twinkleXP]);

  useEffect(() => {
    socket.on('new_reward_posted', handleNewReward);
    function handleNewReward({ receiverId }) {
      if (receiverId === userId) {
        fetchNews();
      }
    }
    return function cleanUp() {
      socket.removeListener('new_reward_posted', handleNewReward);
    };
  });

  const rewardTabShown = useMemo(() => {
    return (
      (!loadingNotifications || activeTab === 'reward') && rewards.length > 0
    );
  }, [activeTab, loadingNotifications, rewards.length]);

  return (
    <ErrorBoundary>
      <div style={style} className={`${container} ${className}`}>
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
                News
              </nav>
              <nav
                className={activeTab === 'rankings' ? 'active' : undefined}
                onClick={() => {
                  userChangedTab.current = true;
                  setActiveTab('rankings');
                }}
              >
                Rankings
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
            {loadingNotifications && activeTab === 'reward' && (
              <Loading
                style={{
                  position: 'absolute',
                  height: 0,
                  top: '2rem'
                }}
              />
            )}
            <MainFeeds
              loadingNotifications={loadingNotifications}
              loadMore={loadMore}
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
      </div>
    </ErrorBoundary>
  );

  function handleFetchNotifications(reloading) {
    if (reloading || notifications.length === 0) {
      fetchNews();
    }
    fetchRankings();
  }

  async function fetchNews() {
    if (!loadingNotificationRef.current) {
      setLoadingNotifications(true);
      loadingNotificationRef.current = true;
      const data = await fetchNotifications();
      if (mounted.current) {
        onFetchNotifications(data);
        setLoadingNotifications(false);
        loadingNotificationRef.current = false;
      }
    }
  }
  async function fetchRankings() {
    const { all, top30s } = await loadRankings();
    if (mounted.current) {
      onGetRanks({ all, top30s });
    }
  }
}

export default memo(Notification);
