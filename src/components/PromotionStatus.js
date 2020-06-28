import React from 'react';
import PropTypes from 'prop-types';

PromotionStatus.propTypes = {
  contentType: PropTypes.string.isRequired,
  promotions: PropTypes.array.isRequired
};

export default function PromotionStatus({ contentType, promotions }) {
  const mostRecentPromotion = promotions[0];

  return promotions && promotions.length > 0 ? (
    <div style={{ padding: '1rem' }}>
      This {contentType} was promoted by {mostRecentPromotion.username}
    </div>
  ) : null;
}
