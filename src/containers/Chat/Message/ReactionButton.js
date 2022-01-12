import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Emojis from './emojis.png';
import ErrorBoundary from 'components/ErrorBoundary';
import { reactionsObj } from 'constants/defaultValues';
import { Color } from 'constants/css';
import { css } from '@emotion/css';
import Icon from 'components/Icon';

const reactions = [
  'angry',
  'crying',
  'surprised',
  'laughing',
  'heart',
  'thumb'
];

ReactionButton.propTypes = {
  style: PropTypes.object,
  onReactionClick: PropTypes.func
};

export default function ReactionButton({ style, onReactionClick }) {
  const [reactionsShown, setReactionsShown] = useState(false);

  return (
    <ErrorBoundary>
      <div
        style={{ display: 'flex', ...style }}
        onMouseEnter={() => setReactionsShown(true)}
        onMouseLeave={() => setReactionsShown(false)}
      >
        {reactionsShown && (
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
                onClick={() => handleReactionClick(reaction)}
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
          style={{ padding: '0.5rem 0.7rem' }}
          skeuomorphic
          filled={reactionsShown}
        >
          <Icon icon="thumbs-up" />
        </Button>
      </div>
    </ErrorBoundary>
  );

  function handleReactionClick(reaction) {
    onReactionClick(reaction);
    setReactionsShown(false);
  }
}
