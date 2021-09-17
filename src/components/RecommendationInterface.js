import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Loading from 'components/Loading';
import { Color, mobileMaxWidth } from 'constants/css';
import { isMobile } from 'helpers';
import { useMyState } from 'helpers/hooks';
import { priceTable } from 'constants/defaultValues';
import { useAppContext, useContentContext } from 'contexts';
import { css } from '@emotion/css';
import SwitchButton from './Buttons/SwitchButton';

RecommendationInterface.propTypes = {
  contentId: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  recommendations: PropTypes.array,
  style: PropTypes.object,
  uploaderId: PropTypes.number
};

const deviceIsMobile = isMobile(navigator);

export default function RecommendationInterface({
  contentId,
  contentType,
  onHide,
  recommendations,
  style,
  uploaderId
}) {
  const { userId, twinkleCoins, authLevel } = useMyState();
  const [recommending, setRecommending] = useState(false);
  const [rewardDisabled, setRewardDisabled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    return function onDismount() {
      mounted.current = false;
    };
  }, []);

  const {
    requestHelpers: { recommendContent }
  } = useAppContext();

  const {
    actions: { onUpdateUserCoins, onRecommendContent }
  } = useContentContext();

  const isOnlyRecommendedByStudents = useMemo(() => {
    let result = recommendations.length > 0;
    for (let recommendation of recommendations) {
      if (recommendation.authLevel > 1) {
        return false;
      }
    }
    return result;
  }, [recommendations]);

  const isRecommendedByUser = useMemo(() => {
    return (
      recommendations.filter(
        (recommendation) => recommendation.userId === userId
      ).length > 0
    );
  }, [recommendations, userId]);

  const disabled = useMemo(() => {
    return !isRecommendedByUser && twinkleCoins < priceTable.recommendation;
  }, [isRecommendedByUser, twinkleCoins]);

  const priceText = useMemo(() => {
    return !isRecommendedByUser ? (
      <>
        <span style={{ marginLeft: '1rem', color: Color.darkBlue() }}>
          (<Icon icon={['far', 'badge-dollar']} /> {priceTable.recommendation})
        </span>
      </>
    ) : null;
  }, [isRecommendedByUser]);

  return hidden ? null : (
    <ErrorBoundary
      style={{
        position: 'relative',
        border: `1px ${Color.borderGray()} solid`,
        borderLeft: 'none',
        borderRight: 'none',
        marginBottom: '1rem',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...style
      }}
    >
      {recommending && (
        <Loading style={{ position: 'absolute', width: '100%', left: 0 }} />
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div
          className={css`
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.3rem;
            }
          `}
          style={{
            fontWeight: 'bold',
            opacity: recommending ? 0 : 1,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div>
            <span style={{ marginRight: '0.7rem' }}>
              {isRecommendedByUser ? (
                <>
                  <span style={{ color: Color.rose(), fontWeight: 'bold' }}>
                    Cancel
                  </span>{' '}
                  your recommendation?
                </>
              ) : (
                `Recommend?`
              )}
              {priceText}
            </span>
          </div>
          <div
            className={css`
              margin-left: 3rem;
              @media (max-width: ${mobileMaxWidth}) {
                margin-left: 1rem;
                margin-right: 1rem;
              }
            `}
          >
            {!isRecommendedByUser && authLevel > 1 && (
              <SwitchButton
                small={deviceIsMobile}
                checked={!rewardDisabled}
                label="Rewardable"
                onChange={() => setRewardDisabled((disabled) => !disabled)}
              />
            )}
          </div>
        </div>
        {!recommending && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              disabled={disabled}
              onClick={handleRecommend}
              color="darkBlue"
              skeuomorphic
            >
              Yes
            </Button>
            <Button
              onClick={onHide}
              style={{ marginLeft: '0.7rem' }}
              color="rose"
              skeuomorphic
            >
              No
            </Button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );

  async function handleRecommend() {
    setRecommending(true);
    const currentRecommendations =
      !isRecommendedByUser && isOnlyRecommendedByStudents
        ? recommendations
        : [];
    try {
      const { coins, recommendations } = await recommendContent({
        contentId,
        contentType,
        uploaderId,
        currentRecommendations,
        rewardDisabled
      });
      if (mounted.current) {
        setHidden(true);
      }
      if (mounted.current) {
        onUpdateUserCoins({ coins, userId });
      }
      if (recommendations && mounted.current) {
        onRecommendContent({ contentId, contentType, recommendations });
      }
      if (mounted.current) {
        onHide();
      }
    } catch (error) {
      console.error(error);
      onHide();
    }
  }
}
