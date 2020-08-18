import React from 'react';
import Cover from './Cover';
import { css } from 'emotion';

export default function Tasks() {
  return (
    <div>
      <Cover />
      <div
        className={css`
          padding: 1rem;
          font-size: 3rem;
          font-weight: bold;
        `}
      >{`Today's Task`}</div>
      <div>This is tasks</div>
    </div>
  );
}
