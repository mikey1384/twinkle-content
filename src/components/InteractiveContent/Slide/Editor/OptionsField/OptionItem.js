import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { Color } from 'constants/css';
import { css } from 'emotion';

OptionItem.propTypes = {
  option: PropTypes.object,
  style: PropTypes.object
};

export default function OptionItem({ option, style }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        ...style
      }}
    >
      <div style={{ padding: '1rem' }}>
        <Button skeuomorphic color={option.icon ? 'black' : 'blue'}>
          {option.icon ? (
            <Icon icon={option.icon} />
          ) : (
            <Icon icon="plus" style={{ color: Color.blue() }} />
          )}
        </Button>
      </div>
      <div
        key={option.id}
        style={{
          fontSize: '1.5rem',
          padding: '1rem 2rem',
          border: `1px solid ${Color.borderGray()}`
        }}
      >
        <span>{option.label}</span>
      </div>
      <div style={{ fontSize: '1.7rem', marginLeft: '1.3rem' }}>
        <Icon
          className={css`
            color: ${Color.darkerGray()};
            &:hover {
              color: ${Color.black()};
            }
          `}
          style={{ cursor: 'pointer' }}
          icon="times"
        />
      </div>
    </div>
  );
}
