import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { priceTable } from 'constants/defaultValues';
import { useAppContext, useContentContext } from 'contexts';

RecommendationInterface.propTypes = {
  contentId: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  recommendations: PropTypes.array,
  style: PropTypes.object
};

export default function RecommendationInterface({
  contentId,
  contentType,
  onHide,
  recommendations,
  style
}) {
  const { userId, twinkleCoins } = useMyState();

  const {
    requestHelpers: { recommendContent }
  } = useAppContext();

  const {
    actions: { onChangeUserCoins, onRecommendContent }
  } = useContentContext();

  const isRecommendedByUser = useMemo(() => {
    return (
      recommendations.filter((recommendation) => recommendation.id === userId)
        .length > 0
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
