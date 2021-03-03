import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from 'components/ProgressBar';
import Icon from 'components/Icon';
import MockUsernameSection from './MockUsernameSection';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';

NotEnoughKarmaInstructions.propTypes = {
  profileTheme: PropTypes.string,
  unlockProgress: PropTypes.number,
  requiredKarmaPoints: PropTypes.number,
  karmaPoints: PropTypes.number
};

export default function NotEnoughKarmaInstructions({
  profileTheme,
  unlockProgress,
  requiredKarmaPoints,
  karmaPoints
}) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <div
        className={css`
          width: 60%;
          display: flex;
          flex-direction: column;
          align-items: center
          padding: 0 1rem;
          >p {
            text-align: center;
          }
          @media (max-width: ${mobileMaxWidth}) {
            width: 90%;
          }
        `}
      >
        <p
          style={{
            fontWeight: 'bold',
            fontSize: '2.3rem'
          }}
        >
          Instructions
        </p>
        <div
          style={{
            width: '100%',
            marginTop: '3rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <p>
            <span>If you go to </span>
            <a style={{ fontWeight: 'bold' }} href="/store" target="_blank">
              Twinkle Store
            </a>
            <span>{`, you will see a section labeled "change your username"`}</span>
          </p>
          <MockUsernameSection
            className={css`
              margin-top: 2rem;
              width: 100%;
            `}
            karmaPoints={karmaPoints}
            requiredKarmaPoints={requiredKarmaPoints}
            unlockProgress={unlockProgress}
          />
        </div>
        <p style={{ marginTop: '2rem' }}>
          See the{' '}
          <span
            style={{
              fontWeight: 'bold',
              color: Color.green(0.5)
            }}
          >
            <Icon icon="unlock" /> unlock
          </span>{' '}
          button below the <Icon icon="lock" /> <span>icon?</span>
        </p>
        <p
          style={{ marginTop: '0.5rem' }}
        >{`Right now that button is faded out and doesn't work`}</p>
        <p style={{ marginTop: '20rem' }}>
          <span>{`This is because you only have ${karmaPoints} karma points`}</span>
        </p>
        <div style={{ width: '100%', padding: '0 1rem' }}>
          <ProgressBar
            style={{ width: '100%', marginTop: '1.5rem' }}
            color={
              unlockProgress === 100 ? Color.green() : Color[profileTheme]()
            }
            progress={unlockProgress}
          />
          <p style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
            You need{' '}
            <b>{addCommasToNumber(requiredKarmaPoints)} karma points</b> to
            unlock this item. You have{' '}
            <b>{addCommasToNumber(karmaPoints)} karma points</b>
          </p>
        </div>
        <p style={{ marginTop: '2rem' }}>
          To make the button work you need to earn{' '}
          <b>{requiredKarmaPoints - karmaPoints} more karma points</b>
        </p>
        <p style={{ marginTop: '20rem' }}>
          Your <b>mission</b> is to press the{' '}
          <span style={{ color: Color.green(), fontWeight: 'bold' }}>
            <Icon icon="unlock" /> unlock
          </span>{' '}
          button from{' '}
          <a style={{ fontWeight: 'bold' }} href="/store" target="_blank">
            Twinkle Store
          </a>{' '}
          after activating it by reaching {requiredKarmaPoints} karma points.
          Come back here when you are done to collect your rewards.
        </p>
        <p
          style={{
            marginTop: '5rem',
            fontWeight: 'bold',
            fontSize: '2rem'
          }}
        >
          Good luck!
        </p>
      </div>
    </div>
  );
}
