import React from 'react';
import PropTypes from 'prop-types';
import UsernameChangeItem from './username_change_item.png';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

TwinkleStore.propTypes = {
  mission: PropTypes.object.isRequired
};

export default function TwinkleStore({ mission }) {
  return (
    <div
      style={{
        fontSize: '1.7rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <p style={{ fontWeight: 'bold', fontSize: '2.3rem' }}>Instructions</p>
      <p style={{ marginTop: '2.5rem' }}>
        <span>In </span>
        <a href="/store" target="_blank">
          Twinkle Store
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
      <div>this is {mission.title}</div>
    </div>
  );
}
