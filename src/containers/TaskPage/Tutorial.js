import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { css } from 'emotion';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';

Tutorial.propTypes = {
  style: PropTypes.object
};

export default function Tutorial({ style }) {
  return (
    <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
      <div
        className={css`
          width: 60%;
          padding: 1rem;
          border: 1px solid ${Color.borderGray()};
          border-radius: ${borderRadius};
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
        style={style}
      >
        <h2>Need help?</h2>
        <div
          style={{
            display: 'flex',
            marginTop: '3rem',
            justifyContent: 'center'
          }}
        >
          <Button
            style={{ marginLeft: '1rem', fontSize: '2rem' }}
            color="rose"
            skeuomorphic
          >
            Start Tutorial
          </Button>
        </div>
      </div>
    </div>
  );
}
