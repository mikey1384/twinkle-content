import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { css } from '@emotion/css';

FinalStep.propTypes = {
  style: PropTypes.object
};

export default function FinalStep({ style }) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontSize: '1.7rem',
        ...style
      }}
      className={css`
        > p {
          line-height: 2;
        }
      `}
    >
      <p>
        Great! You have successfully unlocked the <b>change username item</b>{' '}
        from Twinkle Store.
      </p>
      <p>
        Press the <b style={{ color: Color.brownOrange() }}>button</b> below to
        collect your reward
      </p>
      <Button
        filled
        style={{ marginTop: '5rem', fontSize: '1.7rem' }}
        skeuomorphic
        color="brownOrange"
        onClick={() => console.log('mission completee')}
      >
        <Icon icon="bolt" />
        <span style={{ marginLeft: '1rem' }}>Collect Reward</span>
      </Button>
    </div>
  );
}
