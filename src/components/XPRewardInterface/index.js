import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Textarea from 'components/Texts/Textarea';
import SelectRewardAmount from './SelectRewardAmount';
import Icon from 'components/Icon';
import { css } from '@emotion/css';
import { Color } from 'constants/css';
import {
  addCommasToNumber,
  addEmoji,
  exceedsCharLimit,
  finalizeEmoji,
  stringIsEmpty
} from 'helpers/stringHelpers';
import Button from 'components/Button';
import { returnMaxRewards, priceTable } from 'constants/defaultValues';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext, useInputContext } from 'contexts';

XPRewardInterface.propTypes = {
  contentType: PropTypes.string.isRequired,
  contentId: PropTypes.number.isRequired,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  rewardLevel: PropTypes.number,
  uploaderId: PropTypes.number.isRequired,
  noPadding: PropTypes.bool,
  onReward: PropTypes.func,
  rewards: PropTypes.array.isRequired
};

export default function XPRewardInterface({
  contentId,
  contentType,
  innerRef,
  rewardLevel,
  noPadding,
  onReward,
  rewards,
  uploaderId
}) {
  const {
    requestHelpers: { rewardUser }
  } = useAppContext();
  const { authLevel, twinkleCoins, userId } = useMyState();
  const {
    state,
    actions: { onSetRewardForm }
  } = useInputContext();
  const {
    actions: { onAttachReward, onUpdateUserCoins, onSetXpRewardInterfaceShown }
  } = useContentContext();
  const rewardForm = state['reward' + contentType + contentId] || {};
  const {
    comment: prevComment = '',
    selectedAmount: prevSelectedAmount = 0,
    rewardLevel: prevRewardLevel
  } = rewardForm;

  const maxRewardAmountForOnePerson = useMemo(
    () => Math.min(Math.ceil(returnMaxRewards({ rewardLevel }) / 2), 10),
    [rewardLevel]
  );

  const myRewardables = useMemo(() => {
    const prevRewards = rewards.reduce((prev, reward) => {
      if (reward.rewarderId === userId) {
        return prev + reward.rewardAmount;
      }
      return prev;
    }, 0);
    return Math.max(maxRewardAmountForOnePerson - prevRewards, 0);
  }, [maxRewardAmountForOnePerson, rewards, userId]);

  const remainingRewards = useMemo(() => {
    let currentRewards =
      rewards.length > 0
        ? rewards.reduce((prev, reward) => prev + reward.rewardAmount, 0)
        : 0;
    return returnMaxRewards({ rewardLevel }) - currentRewards;
  }, [rewardLevel, rewards]);

  const rewardables = useMemo(() => {
    return Math.min(remainingRewards, myRewardables);
  }, [myRewardables, remainingRewards]);

  const mounted = useRef(true);
  const commentRef = useRef(prevComment);
  const rewardingRef = useRef(false);
  const [rewarding, setRewarding] = useState(false);
  const [comment, setComment] = useState(prevComment);
  const selectedAmountRef = useRef(prevSelectedAmount);
  const [selectedAmount, setSelectedAmount] = useState(prevSelectedAmount);
  const requiresPayment = authLevel < 2;

  useEffect(() => {
    setSelectedAmount((selectedAmount) =>
      Math.min(selectedAmount, rewardables)
    );
    if (rewardables === 0 && !rewardingRef.current) {
      onSetXpRewardInterfaceShown({
        contentId,
        contentType,
        shown: false
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardables]);

  useEffect(() => {
    handleSetComment(prevComment);
  }, [prevComment]);

  useEffect(() => {
    onSetRewardForm({
      contentType,
      contentId,
      form: {
        selectedAmount: rewardLevel !== prevRewardLevel ? 0 : selectedAmount,
        rewardLevel
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardLevel]);

  const rewardCommentExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'rewardComment',
        text: comment
      }),
    [comment]
  );

  const rewardStatusText = useMemo(
    () =>
      selectedAmount > 0
        ? `Reward ${selectedAmount} Twinkle${
            selectedAmount > 1 ? 's' : ''
          } (${addCommasToNumber(selectedAmount * 200)} XP)`
        : 'Select reward amount',
    [selectedAmount]
  );

  const confirmText = useMemo(() => {
    return (
      <>
        Reward
        {requiresPayment ? (
          <>
            <div style={{ marginLeft: '0.7rem' }}>
              (<Icon icon={['far', 'badge-dollar']} />
              <span style={{ marginLeft: '0.3rem' }}>
                {selectedAmount * priceTable.reward}
              </span>
              )
            </div>
          </>
        ) : (
          ''
        )}
      </>
    );
  }, [requiresPayment, selectedAmount]);

  useEffect(() => {
    return function cleanUp() {
      onSetRewardForm({
        contentType,
        contentId,
        form: {
          comment: commentRef.current,
          selectedAmount: selectedAmountRef.current
        }
      });
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return userId && uploaderId !== userId ? (
    <div
      ref={innerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: noPadding ? '1rem 0 0 0' : '1rem',
        fontSize: '1.6rem',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <Icon
        style={{ position: 'absolute', right: '1rem', cursor: 'pointer' }}
        className={css`
          color: ${Color.darkGray()};
          font-size: 2rem;
          &:hover {
            color: ${Color.black()};
          }
        `}
        onClick={() => {
          onSetXpRewardInterfaceShown({
            contentId,
            contentType,
            shown: false
          });
        }}
        icon="times"
      />
      <section style={{ fontWeight: 'bold' }}>{rewardStatusText}</section>
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center'
        }}
      >
        <SelectRewardAmount
          onSetSelectedAmount={handleSetSelectedAmount}
          rewardables={rewardables}
          selectedAmount={selectedAmount}
        />
        {selectedAmount > 0 && (
          <a
            style={{
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '-0.5rem'
            }}
            onClick={() => handleSetSelectedAmount(0)}
          >
            clear
          </a>
        )}
      </section>
      {selectedAmount > 0 && (
        <Textarea
          className={css`
            margin-top: 1rem;
          `}
          minRows={3}
          value={comment}
          onChange={(event) => {
            handleSetComment(addEmoji(event.target.value));
          }}
          placeholder={`Let the recipient know why you are rewarding XP for this ${
            contentType === 'url' ? 'link' : contentType
          } (optional)`}
          style={rewardCommentExceedsCharLimit?.style}
        />
      )}
      {selectedAmount > 0 && (
        <section
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            width: '100%',
            marginTop: '1rem'
          }}
        >
          <Button
            color={selectedAmount > 4 ? 'pink' : 'logoBlue'}
            filled
            disabled={
              !!rewardCommentExceedsCharLimit ||
              rewarding ||
              selectedAmount === 0 ||
              (requiresPayment &&
                twinkleCoins < selectedAmount * priceTable.reward)
            }
            onClick={handleRewardSubmit}
          >
            {confirmText}
          </Button>
        </section>
      )}
    </div>
  ) : null;

  async function handleRewardSubmit() {
    try {
      rewardingRef.current = true;
      setRewarding(true);
      const { alreadyRewarded, reward, netCoins } = await rewardUser({
        maxRewardAmountForOnePerson,
        explanation: finalizeEmoji(stringIsEmpty(comment) ? '' : comment),
        amount: selectedAmount,
        contentType,
        contentId,
        uploaderId
      });
      if (alreadyRewarded) {
        return window.location.reload();
      }
      if (mounted.current) {
        onSetRewardForm({
          contentType,
          contentId,
          form: undefined
        });
        if (reward) {
          onAttachReward({
            reward,
            contentId,
            contentType
          });
        }
        if (typeof netCoins === 'number') {
          onUpdateUserCoins({ coins: netCoins, userId });
        }
        if (selectedAmount === myRewardables) {
          onReward?.();
        }
        handleSetComment('');
        handleSetSelectedAmount(0);
        setRewarding(false);
        rewardingRef.current = false;
        onSetXpRewardInterfaceShown({
          contentId,
          contentType,
          shown: false
        });
      }
    } catch (error) {
      console.error({ error });
      setRewarding(false);
    }
  }

  function handleSetComment(text) {
    setComment(text);
    commentRef.current = text;
  }

  function handleSetSelectedAmount(amount) {
    setSelectedAmount(amount);
    selectedAmountRef.current = amount;
  }
}
