import React from 'react';
import PropTypes from 'prop-types';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import TextMessage from './TextMessage';

TargetMessage.propTypes = {
  message: PropTypes.object.isRequired
};

export default function TargetMessage({ message }) {
  return (
    <div
      className={css`
        width: 85%;
        @media (max-width: ${mobileMaxWidth}) {
          width: 100%;
        }
      `}
    >
      <TextMessage message={message} />
    </div>
  );
}
