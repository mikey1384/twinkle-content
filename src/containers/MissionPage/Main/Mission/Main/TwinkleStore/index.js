import React from 'react';
import PropTypes from 'prop-types';
import UsernameChangeItem from './username_change_item.png';
import UnlockFaded from './unlock_faded.png';
import Icon from 'components/Icon';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

TwinkleStore.propTypes = {
  mission: PropTypes.object.isRequired
};

export default function TwinkleStore({ mission }) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        fontSize: '1.7rem',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <p style={{ fontWeight: 'bold', fontSize: '2.3rem' }}>Instructions</p>
      <div
        style={{
          marginTop: '2.5rem',
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <p>
          <span>In </span>
          <a href="/store" target="_blank">
            {mission.title}
          </a>
          <span>{`, you will see a section labeled "change your username"`}</span>
        </p>
        <img
          className={css`
            width: 100%;
            max-width: 50rem;
            margin-top: 1.5rem;
            @media (max-width: ${mobileMaxWidth}) {
              max-width: 100%;
            }
          `}
          src={UsernameChangeItem}
        />
      </div>
      <div
        style={{
          marginTop: '5rem',
          display: 'flex',
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <p>
          <span>Below the</span> <Icon icon="lock" />{' '}
          <span>{`icon, there's a button that says "unlock"`}</span>
        </p>
        <img
          className={css`
            width: 100%;
            max-width: 30rem;
            @media (max-width: ${mobileMaxWidth}) {
              max-width: 100%;
            }
          `}
          src={UnlockFaded}
        />
      </div>
    </div>
  );
}
