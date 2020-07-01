import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import { Color } from 'constants/css';

RecommendationInterface.propTypes = {
  isRecommendedByUser: PropTypes.bool,
  contentType: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  onRecommend: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function RecommendationInterface({
  isRecommendedByUser,
  contentType,
  onHide,
  onRecommend,
  style
}) {
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
        <Button onClick={onRecommend} color="darkBlue" skeuomorphic>
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
}
