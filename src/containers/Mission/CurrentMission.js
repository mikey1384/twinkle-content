import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import RewardText from 'components/Texts/RewardText';
import LongText from 'components/Texts/LongText';
import { css } from 'emotion';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { useHistory } from 'react-router-dom';
import { gifTable } from 'constants/defaultValues';
import { useMissionContext } from 'contexts';

CurrentMission.propTypes = {
  style: PropTypes.object,
  missionId: PropTypes.number
};

export default function CurrentMission({ style, missionId }) {
  const history = useHistory();
  const {
    state: { missionObj }
  } = useMissionContext();
  const mission = useMemo(() => missionObj[missionId] || {}, [
    missionId,
    missionObj
  ]);

  return (
    <div style={style} className="desktop">
      <p
        className={css`
          font-size: 2.5rem;
          font-weight: bold;
        `}
      >
        Current Mission
      </p>
      <div
        onClick={() => history.push(`/missions/${missionId}`)}
        className={css`
          background: #fff;
          display: flex;
          flex-direction: column;
          margin-top: 1rem;
          border: 1px solid ${Color.borderGray()};
          padding: 1rem;
          border-radius: ${borderRadius};
          cursor: pointer;
          &:hover {
            background: ${Color.highlightGray()};
          }
        `}
      >
        <div
          className={css`
            font-size: 2rem;
            font-weight: bold;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.5rem;
            }
          `}
        >
          {mission.title}
        </div>
        <div style={{ display: 'flex', marginTop: '1rem' }}>
          <div style={{ display: 'flex', width: '10rem' }}>
            <img style={{ width: '100%' }} src={gifTable[missionId]} />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginLeft: '1rem',
              flexGrow: 1,
              justifyContent: 'space-between'
            }}
          >
            <LongText
              className={css`
                font-size: 1.5rem;
                @media (max-width: ${mobileMaxWidth}) {
                  font-size: 1.3rem;
                }
              `}
            >
              {mission.subtitle}
            </LongText>
            <RewardText
              style={{
                marginTop: '1.5rem'
              }}
              labelClassName={css`
                color: ${Color.darkerGray()};
                font-size: 1.4rem;
                @media (max-width: ${mobileMaxWidth}) {
                  font-size: 1.3rem;
                }
              `}
              rewardClassName={css`
                font-size: 1.3rem;
                @media (max-width: ${mobileMaxWidth}) {
                  font-size: 1.2rem;
                }
              `}
              coinReward={mission.coinReward}
              xpReward={mission.xpReward}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
