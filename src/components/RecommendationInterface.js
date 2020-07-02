import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import { Color } from 'constants/css';
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
  const {
    requestHelpers: { recommendContent }
  } = useAppContext();
  const {
    actions: { onRecommendContent }
  } = useContentContext();

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
            </span>
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button onClick={handleRecommend} color="darkBlue" skeuomorphic>
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
      const recommendations = await recommendContent({
        contentId,
        contentType
      });
      onRecommendContent({ contentId, contentType, recommendations });
      onHide();
    } catch (error) {
      console.error(error);
      onHide();
    }
  }
}
