import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { borderRadius, Color } from 'constants/css';
import { css } from '@emotion/css';

CreatorView.propTypes = {
  tutorialPrompt: PropTypes.string,
  tutorialButtonLabel: PropTypes.string
};

export default function CreatorView({ tutorialPrompt, tutorialButtonLabel }) {
  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          color: Color.blue(),
          fontSize: '1.5rem',
          marginTop: '-1.7rem',
          marginLeft: '-1rem',
          marginBottom: '2rem'
        }}
      >
        <span
          className={css`
            cursor: pointer;
            font-weight: bold;
            &:hover {
              text-decoration: underline;
            }
          `}
        >
          <Icon icon="pencil-alt" />
          <span style={{ marginLeft: '0.7rem' }}>
            This is the preview for your tutorial prompt. Tap here to edit
          </span>
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <h2 style={{ marginBottom: '2rem' }}>{tutorialPrompt}</h2>
        <div
          style={{
            fontSize: '2rem',
            padding: '1rem',
            borderRadius,
            border: `1px solid ${Color.borderGray()}`
          }}
        >
          {tutorialButtonLabel}
        </div>
      </div>
    </div>
  );
}
