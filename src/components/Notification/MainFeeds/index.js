import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import RoundList from 'components/RoundList';
import Banner from 'components/Banner';
import LoadMoreButton from 'components/Buttons/LoadMoreButton';
import Rankings from './Rankings';
import NotiItem from './NotiItem';
import RewardItem from './RewardItem';
import MyRank from 'components/MyRank';
import ErrorBoundary from 'components/ErrorBoundary';
import Loading from 'components/Loading';
import { rewardValue } from 'constants/defaultValues';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext, useNotiContext } from 'contexts';

MainFeeds.propTypes = {
  loadingNotifications: PropTypes.bool.isRequired,
  loadMore: PropTypes.object.isRequired,
  activeTab: PropTypes.string,
  notifications: PropTypes.array.isRequired,
  rewards: PropTypes.array,
  selectNotiTab: PropTypes.func.isRequired,
  style: PropTypes.object
};

function MainFeeds({
  activeTab,
  loadingNotifications,
  loadMore,
  notifications,
  rewards,
  selectNotiTab,
  style
}) {
  const {
    requestHelpers: {
      fetchNotifications,
      loadMoreNotifications,
      loadMoreRewards,
      updateUserXP,
      collectRewardedCoins
    }
  } = useAppContext();
  const { userId, rank, twinkleXP, twinkleCoins } = useMyState();
  const {
    state: { numNewNotis, totalRewardedTwinkles, totalRewardedTwinkleCoins },
    actions: {
      onClearRewards,
      onFetchNotifications,
      onLoadMoreNotifications,
      onLoadMoreRewards
    }
  } = useNotiContext();
  const {
    actions: { onUpdateUserCoins, onChangeUserXP }
  } = useContentContext();
  const [loading, setLoading] = useState(false);
  const [loadingNewFeeds, setLoadingNewFeeds] = useState(false);
  const [collectingReward, setCollectingReward] = useState(false);
  const [originalTwinkleXP, setOriginalTwinkleXP] = useState(0);
  const [originalTwinkleCoins, setOriginalTwinkleCoins] = useState(0);
  const [totalTwinkles, setTotalTwinkles] = useState(0);
  const [totalCoins, setTotalCoins] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    if (totalRewardedTwinkles > 0) {
      setTotalTwinkles(totalRewardedTwinkles);
    }
    if (totalRewardedTwinkleCoins > 0) {
      setTotalCoins(totalRewardedTwinkleCoins);
    }
  }, [totalRewardedTwinkles, totalRewardedTwinkleCoins]);

  useEffect(() => {
    return function unmount() {
      mounted.current = false;
    };
  }, []);

  const totalRewardAmount = useMemo(
    () => totalRewardedTwinkles + totalRewardedTwinkleCoins,
    [totalRewardedTwinkleCoins, totalRewardedTwinkles]
  );

  const NotificationsItems = useMemo(() => {
    return notifications.map((notification) => (
      <NotiItem key={notification.id} notification={notification} />
    ));
  }, [notifications]);

  const RewardListItems = useMemo(() => {
    return rewards.map((reward) => (
      <RewardItem key={reward.id} reward={reward} />
    ));
  }, [rewards]);

  return (
    <ErrorBoundary style={style}>
      {numNewNotis > 0 && !(activeTab === 'reward' && totalRewardAmount > 0) && (
        <Banner
          loading={loadingNewFeeds}
          color="gold"
          style={{ marginBottom: '1rem' }}
          onClick={handleNewNotiAlertClick}
          spinnerDelay={100}
        >
          Tap to See {numNewNotis} New Notification
          {numNewNotis > 1 ? 's' : ''}
        </Banner>
      )}
      {activeTab === 'reward' && !loadingNotifications && (
        <Banner
          loading={collectingReward}
          color={totalRewardAmount > 0 ? 'gold' : 'green'}
          style={{ marginBottom: '1rem' }}
          onClick={totalRewardAmount > 0 ? onCollectReward : null}
        >
          {totalRewardAmount > 0 && (
            <>
              <p>Tap to collect all your rewards</p>
              {totalTwinkles > 0 && (
                <p style={{ fontSize: '1.5rem' }}>
                  * {totalTwinkles} Twinkle{totalTwinkles > 0 ? 's' : ''} (
                  {totalTwinkles} * {rewardValue} ={' '}
                  {addCommasToNumber(totalTwinkles * rewardValue)} XP)
                </p>
              )}
              {totalCoins > 0 && (
                <p style={{ fontSize: '1.5rem' }}>
                  * {addCommasToNumber(totalCoins)} Twinkle Coin
                  {totalCoins > 0 ? 's' : ''}
                </p>
              )}
            </>
          )}
          {totalRewardAmount === 0 && totalTwinkles > 0 && (
            <div style={{ fontSize: '1.7rem' }}>
              <p>
                Your XP: {addCommasToNumber(originalTwinkleXP)} XP {'=>'}{' '}
                {addCommasToNumber(
                  originalTwinkleXP + totalTwinkles * rewardValue
                )}{' '}
                XP
              </p>
              <p style={{ fontSize: '1.5rem' }}>
                (+ {addCommasToNumber(totalTwinkles * rewardValue)} XP)
              </p>
            </div>
          )}
          {totalRewardAmount === 0 && totalCoins > 0 && (
            <div
              style={{
                fontSize: '1.7rem',
                marginTop: totalTwinkles > 0 ? '1rem' : 0
              }}
            >
              <p>
                Your Twinkle Coins: {addCommasToNumber(originalTwinkleCoins)}{' '}
                {'=>'} {addCommasToNumber(originalTwinkleCoins + totalCoins)}
              </p>
              <p style={{ fontSize: '1.5rem' }}>
                (+ {addCommasToNumber(totalCoins)})
              </p>
            </div>
          )}
        </Banner>
      )}
      {activeTab === 'reward' && !!userId && (
        <MyRank myId={userId} rank={rank} twinkleXP={twinkleXP} />
      )}
      {userId &&
        activeTab === 'notification' &&
        notifications.length === 0 &&
        loadingNotifications && <Loading style={{ position: 'absolute' }} />}
      {userId && activeTab === 'notification' && notifications.length > 0 && (
        <RoundList style={{ marginTop: 0 }}>{NotificationsItems}</RoundList>
      )}
      {activeTab === 'rankings' && <Rankings />}
      {activeTab === 'reward' && rewards.length > 0 && (
        <RoundList style={{ marginTop: 0 }}>{RewardListItems}</RoundList>
      )}
      {((activeTab === 'notification' && loadMore.notifications) ||
        (activeTab === 'reward' && loadMore.rewards)) &&
        !!userId && (
          <LoadMoreButton
            style={{ marginTop: '1rem' }}
            loading={loading}
            color="lightBlue"
            filled
            stretch
            onClick={onLoadMore}
          />
        )}
    </ErrorBoundary>
  );

  async function onCollectReward() {
    setOriginalTwinkleXP(twinkleXP);
    setOriginalTwinkleCoins(twinkleCoins);
    setCollectingReward(true);
    const coins = await collectRewardedCoins();
    const { xp, rank } = await updateUserXP({
      action: 'collect'
    });
    if (mounted.current) {
      onUpdateUserCoins({ coins, userId });
    }
    if (mounted.current) {
      onChangeUserXP({ xp, rank, userId });
    }
    if (mounted.current) {
      onClearRewards();
    }
    if (mounted.current) {
      setCollectingReward(false);
    }
  }

  async function handleNewNotiAlertClick() {
    setLoadingNewFeeds(true);
    const data = await fetchNotifications();
    if (mounted.current) {
      onFetchNotifications(data);
    }
    if (mounted.current) {
      selectNotiTab();
    }
    if (mounted.current) {
      setLoadingNewFeeds(false);
    }
  }

  async function onLoadMore() {
    setLoading(true);
    if (activeTab === 'notification') {
      const data = await loadMoreNotifications(
        notifications[notifications.length - 1].id
      );
      if (mounted.current) {
        onLoadMoreNotifications(data);
      }
    } else {
      const data = await loadMoreRewards(rewards[rewards.length - 1].id);
      if (mounted.current) {
        onLoadMoreRewards(data);
      }
    }
    if (mounted.current) {
      setLoading(false);
    }
  }
}

export default memo(MainFeeds);
