import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import UserListModal from 'components/Modals/UserListModal';
import { Color } from 'constants/css';
import { useMyState } from 'helpers/hooks';

RecommendationStatus.propTypes = {
  contentType: PropTypes.string.isRequired,
  recommendations: PropTypes.array.isRequired,
  style: PropTypes.object
};

export default function RecommendationStatus({
  contentType,
  recommendations = [],
  style
}) {
  const { profileTheme, userId } = useMyState();
  const [userListModalShown, setUserListModalShown] = useState(false);
  const recommendationsByUsertype = useMemo(() => {
    const result = [...recommendations];
    result.sort((a, b) => b.authLevel - a.authLevel);
    return result;
  }, [recommendations]);

  const me = recommendationsByUsertype.filter(
    (recommendation) => recommendation.userId === userId
  )[0];

  const recommendationsByUsertypeExceptMe = recommendationsByUsertype.filter(
    (recommendation) => recommendation.userId !== userId
  );

  const mostRecentRecommenderOtherThanMe = recommendationsByUsertypeExceptMe[0];
  const isRecommendedByModerator =
    me?.authLevel > 0 || mostRecentRecommenderOtherThanMe?.authLevel > 0;

  return recommendations.length > 0 ? (
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
        fontSize: '1.5rem',
        ...style
      }}
    >
      <div>
        Recommended by{' '}
        {me && (
          <b
            style={{
              color: isRecommendedByModerator ? '#000' : Color.black()
            }}
          >
            you
          </b>
        )}
        {mostRecentRecommenderOtherThanMe && (
          <>
            {me &&
              (recommendationsByUsertypeExceptMe.length > 1 ? ', ' : ' and ')}
            <UsernameText
              color={isRecommendedByModerator ? '#000' : Color.black()}
              user={{
                username: mostRecentRecommenderOtherThanMe.username,
                id: mostRecentRecommenderOtherThanMe.userId
              }}
            />
          </>
        )}
        {recommendationsByUsertypeExceptMe.length === 2 && (
          <>
            {' '}
            and{' '}
            <UsernameText
              color={isRecommendedByModerator ? '#000' : Color.black()}
              user={{
                username: recommendationsByUsertypeExceptMe[1].username,
                id: recommendationsByUsertypeExceptMe[1].userId
              }}
            />
          </>
        )}
        {recommendationsByUsertypeExceptMe.length > 2 && (
          <>
            {' '}
            and{' '}
            <a
              style={{ cursor: 'pointer', fontWeight: 'bold', color: '#000' }}
              onClick={() => setUserListModalShown(true)}
            >
              {recommendationsByUsertypeExceptMe.length - 1} others
            </a>
          </>
        )}
      </div>
      {userListModalShown && (
        <UserListModal
          onHide={() => setUserListModalShown(false)}
          title={`People who recommended this ${contentType}`}
          users={recommendationsByUsertype.map((user) => ({
            ...user,
            id: user.userId
          }))}
        />
      )}
    </div>
  ) : null;
}
