import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { css } from 'emotion';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';

Task.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  style: PropTypes.object
};
export default function Task({ title, subtitle, description, style }) {
  return (
    <div
      className={css`
        width: 50%;
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        @media (max-width: ${mobileMaxWidth}) {
          width: 100%;
        }
      `}
      style={style}
    >
      <div>
        <h1>{title}</h1>
        <p style={{ fontSize: '1.7rem' }}>{subtitle}</p>
      </div>
      <div
        style={{
          marginTop: '3rem',
          display: 'flex',
          justifyContent: 'center',
          fontSize: '2rem'
        }}
      >
        {description}
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}
      >
        <Button
          color="blue"
          skeuomorphic
          style={{ fontSize: '2rem' }}
          onClick={() => console.log('clicked')}
        >
          Submit
        </Button>
        <Button
          style={{ marginLeft: '1rem', fontSize: '1.7rem' }}
          color="pink"
          skeuomorphic
        >
          Help me
        </Button>
      </div>
    </div>
  );
}
