import React from 'react';
import { css } from 'emotion';
import { Color, borderRadius } from 'constants/css';

export default function NewSlideForm() {
  return (
    <div
      className={css`
        background: #fff;
        width: 100%;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
      `}
    >
      <div>Adding new slide!!</div>
    </div>
  );
}
