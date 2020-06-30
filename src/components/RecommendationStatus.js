import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import { Color } from 'constants/css';
import { useMyState } from 'helpers/hooks';

RecommendationStatus.propTypes = {
  recommendations: PropTypes.array.isRequired
};

export default function RecommendationStatus({ recommendations }) {
  const { profileTheme } = useMyState();
  const recommendationsByUsertype = useMemo(() => {
    const result = [...recommendations];
    result.sort((a, b) => b.authLevel - a.authLevel);
    return result;
  }, [recommendations]);

  const mostRecentRecommender = recommendationsByUsertype[0];
  const isRecommendedByModerator = mostRecentRecommender?.authLevel > 0;

  return recommendations && recommendations.length > 0 ? (
    <div
      style={{
        padding: '0.5rem',
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
          color={isRecommendedByModerator && Color[profileTheme]()}
          user={{
            username: mostRecentRecommender.username,
            id: mostRecentRecommender.id
          }}
        />
      </div>
    </div>
  ) : null;
}
