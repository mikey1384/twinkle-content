import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import UserListModal from 'components/Modals/UserListModal';
import { Color } from 'constants/css';
import { useMyState } from 'helpers/hooks';

RecommendationStatus.propTypes = {
  contentType: PropTypes.string.isRequired,
  recommendations: PropTypes.array.isRequired
};

export default function RecommendationStatus({ contentType, recommendations }) {
  const { profileTheme } = useMyState();
  const [userListModalShown, setUserListModalShown] = useState(false);
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
        background: isRecommendedByModerator && Color[profileTheme](0.1),
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
          color={isRecommendedByModerator ? '#000' : ''}
          user={{
            username: mostRecentRecommender.username,
            id: mostRecentRecommender.id
          }}
        />
        {recommendations.length === 2 && (
          <>
            {' '}
            and{' '}
            <UsernameText
              color={isRecommendedByModerator ? '#000' : ''}
              user={{
                username: recommendationsByUsertype[1].username,
                id: recommendationsByUsertype[1].id
              }}
            />
          </>
        )}
        {recommendations.length > 2 && (
          <>
            {' '}
            and{' '}
            <a
              style={{ cursor: 'pointer', fontWeight: 'bold', color: '#000' }}
              onClick={() => setUserListModalShown(true)}
            >
              {recommendations.length - 1} others
            </a>
          </>
        )}
      </div>
      {userListModalShown && (
        <UserListModal
          onHide={() => setUserListModalShown(false)}
          title={`People who recommended this ${contentType}`}
          users={recommendationsByUsertype}
        />
      )}
    </div>
  ) : null;
}
