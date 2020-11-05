import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { css } from 'emotion';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';

ItemPanel.propTypes = {
  itemName: PropTypes.string.isRequired,
  itemDescription: PropTypes.string.isRequired,
  karmaPoints: PropTypes.number,
  style: PropTypes.object
};

export default function ItemPanel({
  itemName,
  itemDescription,
  style,
  karmaPoints
}) {
  return (
    <div
      className={css`
        border-radius: ${borderRadius};
        @media (max-width: ${mobileMaxWidth}) {
          border-radius: 0;
        }
      `}
      style={{
        background: '#fff',
        border: `1px solid ${Color.borderGray()}`,
        padding: '1rem',
        ...style
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '2rem' }}>{itemName}</div>
      <p style={{ fontSize: '1.3rem' }}>{itemDescription}</p>
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.7rem'
        }}
      >
        <Icon size="3x" icon="lock" />
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            width: '100%',
            justifyContent: 'center'
          }}
        >
          <Button skeuomorphic color="logoBlue">
            Unlock
          </Button>
        </div>
      </div>
      <div>You have {karmaPoints} karma points</div>
    </div>
  );
}
