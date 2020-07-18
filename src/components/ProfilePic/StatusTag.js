import React from 'react';
import PropTypes from 'prop-types';
import {
  borderRadius,
  innerBorderRadius,
  Color,
  mobileMaxWidth
} from 'constants/css';
import { css } from 'emotion';

StatusTag.propTypes = {
  large: PropTypes.bool,
  status: PropTypes.string
};

export default function StatusTag({ large, status = 'online' }) {
  const backgroundColor = {
    online: Color.green(),
    busy: Color.red(),
    away: Color.orange()
  };

  return large ? (
    <div
      className={css`
        top: 74%;
        left: 70%;
        background: #fff;
        position: absolute;
        border: 3px solid #fff;
        border-radius: ${borderRadius};
        @media (max-width: ${mobileMaxWidth}) {
          top: 73%;
          border-radius: 47%;
        }
      `}
    >
      <div
        className={css`
          background: ${backgroundColor[status]};
          color: #fff;
          padding: 0.3rem;
          min-width: 5rem;
          font-size: 1.4rem;
          text-align: center;
          border-radius: ${innerBorderRadius};
          font-weight: bold;
          @media (max-width: ${mobileMaxWidth}) {
            min-height: 2rem;
            min-width: 2rem;
            border-radius: 50%;
          }
        `}
      >
        <span className="desktop">{status}</span>
      </div>
    </div>
  ) : (
    <div
      style={{
        top: '70%',
        left: '67%',
        background: '#fff',
        position: 'absolute',
        border: '2px solid #fff',
        borderRadius: '47%'
      }}
    >
      <div
        style={{
          background: backgroundColor[status],
          padding: '0.3rem',
          width: '1rem',
          height: '1rem',
          textAlign: 'center',
          borderRadius: '50%'
        }}
      />
    </div>
  );
}
