import React from 'react';
import PropTypes from 'prop-types';
import RewardText from 'components/Texts/RewardText';
import { gifTable } from 'constants/defaultValues';
import { css } from 'emotion';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { useHistory } from 'react-router-dom';
import { useAppContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

MissionItem.propTypes = {
  style: PropTypes.object,
  mission: PropTypes.object.isRequired
};
export default function MissionItem({ style, mission }) {
  const history = useHistory();
  const { userId } = useMyState();
  const {
    user: {
      actions: { onOpenSigninModal }
    }
  } = useAppContext();
  return (
    <div
      onClick={handleLinkClick}
      style={style}
      className={css`
        background: #fff;
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        cursor: pointer;
        &:hover {
          background: ${Color.highlightGray()};
        }
      `}
    >
      <p
        className={css`
          font-size: 2rem;
          font-weight: bold;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.7rem;
          }
        `}
      >
        {mission.title}
      </p>
      <div style={{ marginTop: '1rem', display: 'flex' }}>
        <img
          src={gifTable[mission.id]}
          style={{ width: '10rem', height: '6rem' }}
        />
        <div
          style={{
            marginLeft: '1rem',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div
            style={{ width: '100%' }}
            className={css`
              font-size: 1.7rem;
              @media (max-width: ${mobileMaxWidth}) {
                font-size: 1.3rem;
              }
            `}
          >
            {mission.subtitle}
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: '1.5rem'
            }}
          >
            <RewardText
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
              rewardStyle={{ fontSize: '1.2rem' }}
              coinReward={mission.coinReward}
              xpReward={mission.xpReward}
            />
            {mission.myAttempt?.status &&
              mission.myAttempt?.status !== 'pending' && (
                <div
                  className={css`
                    font-size: 1.3rem;
                    @media (max-width: ${mobileMaxWidth}) {
                      font-size: 1.1rem;
                    }
                  `}
                  style={{
                    fontWeight: 'bold',
                    color:
                      mission.myAttempt?.status === 'pass'
                        ? Color.green()
                        : Color.rose()
                  }}
                >
                  {mission.myAttempt?.status}ed
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );

  function handleLinkClick() {
    if (userId) {
      history.push(`/missions/${mission.id}`);
    } else {
      onOpenSigninModal();
    }
  }
}
