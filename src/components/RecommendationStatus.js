import React from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import { Color } from 'constants/css';

RecommendationStatus.propTypes = {
  recommendations: PropTypes.array.isRequired
};

export default function RecommendationStatus({ recommendations }) {
  const mostRecentRecommender = recommendations[0];

  return recommendations && recommendations.length > 0 ? (
    <div
      style={{
        padding: '1rem',
        borderTop: `1px solid ${Color.borderGray()}`,
        borderBottom: `1px solid ${Color.borderGray()}`,
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5rem'
      }}
    >
      <div>
        Recommended by{' '}
        <UsernameText
          user={{
            username: mostRecentRecommender.username,
            id: mostRecentRecommender.id
          }}
        />
      </div>
    </div>
  ) : null;
}
