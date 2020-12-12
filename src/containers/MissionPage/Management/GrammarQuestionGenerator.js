import React from 'react';
import { css } from 'emotion';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';

export default function GrammarQuestionGenerator() {
  return (
    <div style={{ width: '100%' }}>
      <div
        className={css`
          padding: 1rem;
          background: #fff;
          border: 1px solid ${Color.borderGray()};
          border-radius: ${borderRadius};
          @media (max-width: ${mobileMaxWidth}) {
            border-radius: 0;
            border-left: 0;
            border-right: 0;
          }
        `}
      >
        This is grammar generator
      </div>
    </div>
  );
}
