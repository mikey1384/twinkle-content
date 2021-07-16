import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useMyState } from 'helpers/hooks';
import { useHistory } from 'react-router-dom';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
import { useAppContext } from 'contexts';
import { checkMultiMissionPassStatus } from 'helpers/userDataHelpers';
import ProfilePic from 'components/ProfilePic';

Cover.propTypes = {
  missionIds: PropTypes.array.isRequired,
  missionObj: PropTypes.object.isRequired,
  myAttempts: PropTypes.object.isRequired
};

export default function Cover({ missionIds, missionObj, myAttempts }) {
  const history = useHistory();
  const { profileTheme, profilePicUrl, userId, username } = useMyState();
  const {
    requestHelpers: { loadMissionRankings }
  } = useAppContext();
  const [numComplete, setNumComplete] = useState(0);
  const [myGrammarRank, setMyGrammarRank] = useState(0);
  useEffect(() => {
    let numCompleteCount = 0;
    for (let missionId of missionIds) {
      const mission = missionObj[missionId];
      if (mission.isMultiMission) {
        const { passed } = checkMultiMissionPassStatus({
          mission,
          myAttempts
        });
        if (passed) {
          numCompleteCount++;
        }
      } else if (myAttempts[missionId]?.status === 'pass') {
        numCompleteCount++;
      }
      if (mission.missionType === 'grammar') {
        handleLoadRanking(missionId, (myRank) => setMyGrammarRank(myRank));
      }
    }
    setNumComplete(numCompleteCount);

    async function handleLoadRanking(missionId, callback) {
      const { myRank } = await loadMissionRankings(missionId);
      callback(myRank);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionObj, missionIds]);

  return (
    <div
      className={css`
        width: 100%;
        height: 15vh;
        display: flex;
        justify-content: space-between;
        background: ${Color[profileTheme]()};
        padding: 0 5%;
        @media (max-width: ${mobileMaxWidth}) {
          height: 8rem;
          padding-left: 1rem;
          padding-right: 1rem;
        }
      `}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <ProfilePic
          className={css`
            width: 9rem;
            height: 9rem;
            font-size: 2rem;
            z-index: 10;
            @media (max-width: ${mobileMaxWidth}) {
              width: 5rem;
              height: 5rem;
            }
          `}
          userId={userId}
          profilePicUrl={profilePicUrl}
        />
        <div
          className={css`
            margin-left: 3rem;
            font-size: 3rem;
            color: #fff;
            font-weight: bold;
            @media (max-width: ${mobileMaxWidth}) {
              margin-left: 1.5rem;
              font-size: 1.7rem;
            }
          `}
        >
          {username}
        </div>
      </div>
      <div
        className={css`
          height: 100%;
          display: flex;
          align-items: center;
          color: #fff;
          justify-content: center;
          flex-direction: column;
          font-weight: bold;
          font-size: 2rem;
          line-height: 2;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.3rem;
          }
        `}
      >
        {numComplete > 0 && (
          <div>
            <span className="mobile">
              Completed: {numComplete}/{missionIds.length}
            </span>
            <span className="desktop">
              Completed {numComplete} out of {missionIds.length} mission
              {missionIds.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
        {!!myGrammarRank && myGrammarRank < 31 && (
          <div
            className={css`
              cursor: pointer;
              &:hover {
                text-decoration: underline;
              }
              @media (max-width: ${mobileMaxWidth}) {
                &:hover {
                  text-decoration: none;
                }
              }
            `}
            onClick={() => history.push('/missions/4')}
            style={{ color: myGrammarRank === 1 ? Color.gold() : '#fff' }}
          >
            Grammar Rank #{myGrammarRank}
          </div>
        )}
      </div>
    </div>
  );
}
