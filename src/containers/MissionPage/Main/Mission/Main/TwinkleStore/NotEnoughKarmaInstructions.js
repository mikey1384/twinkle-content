import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
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
      <p style={{ fontWeight: 'bold', fontSize: '2.3rem' }}>Instructions</p>
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
            width: 60%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 90%;
            }
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
      <p>{`Right now that button is faded out and doesn't work`}</p>
      <p style={{ marginTop: '20rem' }}>
        <span>{`This is because you don't have enough karma points`}</span>
      </p>
      <div
        className={css`
          width: 60%;
          padding: 0 1rem;
          @media (max-width: ${mobileMaxWidth}) {
            width: 90%;
          }
        `}
      >
        <ProgressBar
          style={{ width: '100%', marginTop: '1.5rem' }}
          color={unlockProgress === 100 ? Color.green() : Color[profileTheme]()}
          progress={unlockProgress}
        />
        <p style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
          You need <b>{addCommasToNumber(requiredKarmaPoints)} karma points</b>{' '}
          to unlock this item. You have{' '}
          <b>{addCommasToNumber(karmaPoints)} karma points</b>
        </p>
      </div>
      <p style={{ marginTop: '20rem' }}>
        To make the button work, you need to earn{' '}
        <b>{requiredKarmaPoints - karmaPoints} more karma points</b>
      </p>
      <p style={{ marginTop: '1rem' }}>
        Once you do, the button will become enabled and look like this:
      </p>
      <div
        className={css`
          display: flex;
          justify-content: center;
          width: 100%;
          margin-top: 1rem;
        `}
      >
        <Button
          skeuomorphic
          color="green"
          style={{ fontSize: '3rem', padding: '2rem', cursor: 'default' }}
          onClick={() => null}
        >
          <Icon icon="unlock" />
          <span style={{ marginLeft: '0.7rem' }}>Unlock</span>
        </Button>
      </div>
      <p style={{ marginTop: '20rem' }}>
        <span>
          Your <b>mission</b> is to earn the remaining
        </span>{' '}
        {requiredKarmaPoints - karmaPoints} karma points{' '}
      </p>
      <p style={{ marginTop: '1rem' }}>
        <span>and press the</span>{' '}
        <span style={{ color: Color.green(), fontWeight: 'bold' }}>
          <Icon icon="unlock" /> unlock
        </span>{' '}
        button once it gets enabled in{' '}
        <a style={{ fontWeight: 'bold' }} href="/store" target="_blank">
          Twinkle Store
        </a>
        .
      </p>
      <p style={{ marginTop: '1rem' }}>
        When you are done, come back here to claim your reward.
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
  );
}
