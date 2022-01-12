import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Emojis from './emojis.png';
import ErrorBoundary from 'components/ErrorBoundary';
import { reactionsObj } from 'constants/defaultValues';
import { Color } from 'constants/css';
import { css } from '@emotion/css';

ReactionButton.propTypes = {
  style: PropTypes.object
};
const reactions = [
  'thumb',
  'angry',
  'crying',
  'surprised',
  'laughing',
  'heart'
];

export default function ReactionButton({ style }) {
  const [mouseEntered, setMouseEntered] = useState(false);

  return (
    <ErrorBoundary>
      <div
        style={{ display: 'flex', ...style }}
        onMouseEnter={() => setMouseEntered(true)}
        onMouseLeave={() => setMouseEntered(false)}
      >
        {mouseEntered && (
          <div
            style={{
              width: '20rem',
              background: 'rgb(255, 255, 255)',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginRight: '0.5rem',
              boxShadow: `0 0 1px ${Color.black()}`,
              outline: 0
            }}
          >
            {reactions.map((reaction) => (
              <div
                key={reaction}
                className={css`
                  cursor: pointer;
                  width: 2rem;
                  height: 2rem;
                  background: url(${Emojis}) ${reactionsObj[reaction].position} /
                    5100%;
                  transition: all 0.1s ease-in-out;
                  &:hover {
                    transform: scale(1.5);
                  }
                `}
              />
            ))}
          </div>
        )}
        <Button
          className={`menu-button ${css`
            opacity: 0.8;
            &:hover {
              opacity: 1;
            }
          `}`}
          style={{ padding: '0.1rem 0.5rem' }}
          skeuomorphic
        >
          <div
            style={{
              width: '2rem',
              height: '2rem',
              background: `url(${Emojis}) ${reactionsObj.thumb.position} / 5100%`
            }}
          />
        </Button>
      </div>
    </ErrorBoundary>
  );
}
