import React from 'react';
import PropTypes from 'prop-types';
import RewardText from 'components/Texts/RewardText';
import { gifTable } from 'constants/defaultValues';
import { css } from '@emotion/css';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { useHistory } from 'react-router-dom';
import { useAppContext, useMissionContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

TaskItem.propTypes = {
  isRepeatable: PropTypes.bool,
  style: PropTypes.object,
  task: PropTypes.object.isRequired,
  parentType: PropTypes.string.isRequired,
  showStatus: PropTypes.bool
};

export default function TaskItem({
  isRepeatable,
  style,
  task,
  parentType,
  showStatus = true
}) {
  const {
    state: { myAttempts }
  } = useMissionContext();
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
        {task.title}
      </p>
      <div style={{ marginTop: '1rem', display: 'flex' }}>
        <img
          src={gifTable[task.id]}
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
            {task.subtitle}
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
              isRepeating={isRepeatable}
              coinReward={
                isRepeatable ? task.repeatCoinReward : task.coinReward
              }
              xpReward={isRepeatable ? task.repeatXpReward : task.xpReward}
            />
            {myAttempts[task.id]?.status &&
              myAttempts[task.id]?.status !== 'pending' &&
              showStatus && (
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
                      myAttempts[task.id]?.status === 'pass'
                        ? Color.green()
                        : Color.rose()
                  }}
                >
                  {myAttempts[task.id]?.status}ed
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );

  function handleLinkClick() {
    if (userId) {
      history.push(`/missions/${parentType}/${task.missionType}`);
    } else {
      onOpenSigninModal();
    }
  }
}
