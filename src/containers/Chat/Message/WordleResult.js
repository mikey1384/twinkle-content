import React, { useContext, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import DropdownButton from 'components/Buttons/DropdownButton';
import Icon from 'components/Icon';
import localize from 'constants/localize';
import LocalContext from '../Context';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
import { addCommasToNumber } from 'helpers/stringHelpers';
import {
  wordLevelHash,
  wordleGuessReaction,
  SELECTED_LANGUAGE
} from 'constants/defaultValues';
import { isMobile } from 'helpers';

const deviceIsMobile = isMobile(navigator);
const replyLabel = localize('reply2');

WordleResult.propTypes = {
  channelId: PropTypes.number,
  myId: PropTypes.number,
  userId: PropTypes.number,
  username: PropTypes.string,
  onReplyClick: PropTypes.func.isRequired,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wordleResult: PropTypes.object.isRequired
};

export default function WordleResult({
  channelId,
  username,
  userId,
  myId,
  onReplyClick,
  wordleResult,
  timeStamp
}) {
  const [dropdownShown, setDropdownShown] = useState(false);
  const {
    actions: { onSetReplyTarget }
  } = useContext(LocalContext);
  const DropdownButtonRef = useRef(null);
  const {
    isSolved,
    isStrict,
    numGuesses,
    solution,
    xpRewardAmount,
    wordLevel
  } = wordleResult;
  const displayedUserLabel = useMemo(() => {
    if (userId === myId) {
      if (SELECTED_LANGUAGE === 'kr') {
        return '회원';
      }
      return 'You';
    }
    return (
      <UsernameText
        color="#fff"
        user={{
          id: userId,
          username
        }}
      />
    );
  }, [myId, userId, username]);

  const rewardAmountLabel = useMemo(
    () => addCommasToNumber(xpRewardAmount),
    [xpRewardAmount]
  );

  const guessLabel = useMemo(() => {
    if (wordleGuessReaction[numGuesses]) {
      return wordleGuessReaction[numGuesses];
    }
    return null;
  }, [numGuesses]);

  const guessLabelColor = useMemo(
    () =>
      numGuesses <= 2
        ? Color.gold()
        : numGuesses === 3
        ? Color.brownOrange()
        : Color.orange(),
    [numGuesses]
  );

  const bonusLabel = useMemo(() => {
    if (numGuesses < 3) {
      return null;
    }
    return isSolved && isStrict ? 'double reward bonus' : null;
  }, [isSolved, isStrict, numGuesses]);

  return (
    <div
      className={css`
        .menu-button {
          display: ${dropdownShown ? 'block' : 'none'};
        }
        &:hover {
          .menu-button {
            display: block;
          }
        }
      `}
      style={{
        width: '100%',
        background: Color.darkBlueGray(),
        color: '#fff',
        marginBottom: '1.5rem',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-0.5rem',
          right: '1rem'
        }}
      >
        <DropdownButton
          skeuomorphic
          buttonStyle={{
            fontSize: '1rem',
            lineHeight: 1
          }}
          className="menu-button"
          innerRef={DropdownButtonRef}
          color="darkerGray"
          icon={deviceIsMobile ? 'chevron-down' : 'ellipsis-h'}
          opacity={0.8}
          menuProps={[
            {
              label: (
                <>
                  <Icon icon="reply" />
                  <span style={{ marginLeft: '1rem' }}>{replyLabel}</span>
                </>
              ),
              onClick: () => {
                onSetReplyTarget({
                  channelId,
                  target: { wordleResult, timeStamp, userId, username }
                });
                onReplyClick();
              }
            }
          ]}
          onDropdownShown={setDropdownShown}
        />
      </div>
      <div
        className={css`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          width: 100%;
          padding: 2rem 1rem;
          font-size: 1.6rem;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.3rem;
          }
        `}
      >
        {guessLabel && (
          <p
            style={{
              marginBottom: '0.5rem',
              color: guessLabelColor,
              fontWeight: 'bold'
            }}
            className={css`
              font-size: ${numGuesses === 1
                ? '3rem'
                : numGuesses === 2
                ? '2.5rem'
                : numGuesses === 3
                ? '2.2rem'
                : '2rem'};
              @media (max-width: ${mobileMaxWidth}) {
                font-size: ${numGuesses === 1
                  ? '2.3rem'
                  : numGuesses === 2
                  ? '2rem'
                  : numGuesses === 3
                  ? '1.7rem'
                  : '1.5rem'};
              }
            `}
          >
            {guessLabel}
          </p>
        )}
        <div style={{ textAlign: 'center' }}>
          {displayedUserLabel} earned{' '}
          <span
            className={css`
              font-size: ${numGuesses <= 2 ? '2rem' : ''};
              @media (max-width: ${mobileMaxWidth}) {
                font-size: ${numGuesses <= 2 ? '1.5rem' : ''};
              }
            `}
            style={{
              fontWeight: isSolved ? 'bold' : ''
            }}
          >
            {rewardAmountLabel} XP
          </span>{' '}
          for {isSolved ? 'solving' : 'trying to solve'} a Wordle{' '}
          {isSolved ? (
            <>
              in{' '}
              <span
                style={{ fontWeight: numGuesses <= 4 ? 'bold' : 'default' }}
              >
                {numGuesses} guess
                {numGuesses === 1
                  ? '!!!'
                  : numGuesses === 2
                  ? 'es!!'
                  : numGuesses === 3
                  ? 'es!'
                  : 'es'}
              </span>
            </>
          ) : (
            ''
          )}
        </div>
        <p style={{ marginTop: '0.5rem' }}>
          The word was <b>{solution}</b> (
          <b style={{ color: Color[wordLevelHash[wordLevel].color]() }}>
            {wordLevelHash[wordLevel].label}
          </b>{' '}
          word)
        </p>
        <p
          style={{
            marginTop: '0.5rem',
            fontWeight: 'bold',
            color: Color.brownOrange()
          }}
        >
          {bonusLabel}
        </p>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '5px',
          right: '8px'
        }}
        className={css`
          font-size: 1rem;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 0.8rem;
          }
        `}
      >
        {timeStamp}
      </div>
    </div>
  );
}
