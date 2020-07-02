import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import { Color } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { priceTable } from 'constants/defaultValues';
import { useAppContext, useContentContext } from 'contexts';

RecommendationInterface.propTypes = {
  isRecommendedByUser: PropTypes.bool,
  contentId: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function RecommendationInterface({
  isRecommendedByUser,
  contentId,
  contentType,
  onHide,
  style
}) {
  const { authLevel, userId, twinkleCoins } = useMyState();

  const {
    requestHelpers: { recommendContent }
  } = useAppContext();

  const {
    actions: { onChangeUserCoins, onRecommendContent }
  } = useContentContext();

  const disabled = useMemo(() => {
    if (authLevel > 0) {
      return isRecommendedByUser && twinkleCoins < priceTable.recommendation;
    } else {
      return !isRecommendedByUser && twinkleCoins < priceTable.recommendation;
    }
  }, [authLevel, isRecommendedByUser, twinkleCoins]);

  const priceText = useMemo(() => {
    if (authLevel > 0) {
      return isRecommendedByUser ? (
        <>
          <span style={{ marginLeft: '1rem', color: Color.darkBlue() }}>
            ({priceTable.recommendation} Twinkle Coins)
          </span>
        </>
      ) : null;
    } else {
      return !isRecommendedByUser ? (
        <>
          <span style={{ marginLeft: '1rem', color: Color.darkBlue() }}>
            ({priceTable.recommendation} Twinkle Coins)
          </span>
        </>
      ) : null;
    }
  }, [authLevel, isRecommendedByUser]);

  return (
    <ErrorBoundary
      style={{
        border: `1px ${Color.borderGray()} solid`,
        borderLeft: 'none',
        borderRight: 'none',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        ...style
      }}
    >
      <div>
        <div>
          <span style={{ fontWeight: 'bold' }}>
            <span style={{ marginRight: '0.7rem' }}>
              {isRecommendedByUser ? (
                <>
                  <span style={{ color: Color.rose(), fontWeight: 'bold' }}>
                    Cancel
                  </span>{' '}
                  your recommendation?
                </>
              ) : (
                `Recommend this ${contentType}?`
              )}
              {priceText}
            </span>
          </span>
        </div>
      </div>
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
    </ErrorBoundary>
  );

  async function handleRecommend() {
    try {
      const { coins, recommendations } = await recommendContent({
        contentId,
        contentType
      });
      onChangeUserCoins({ coins, userId });
      onRecommendContent({ contentId, contentType, recommendations });
      onHide();
    } catch (error) {
      console.error(error);
      onHide();
    }
  }
}
