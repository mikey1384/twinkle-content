import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import Notification from 'components/Notification';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';

export default function Shop() {
  return (
    <ErrorBoundary
      className={css`
        width: 100%;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        @media (max-width: ${mobileMaxWidth}) {
          margin-top: 0;
        }
      `}
    >
      <div
        className={css`
          width: CALC(100vw - 34rem);
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
            margin-top: 0;
            margin-left: 0;
            margin-right: 0;
          }
        `}
      >
        <SectionPanel loaded title="Tier 1">
          <div>This is my section</div>
        </SectionPanel>
        <SectionPanel loaded title="Tier 2">
          <div>This is my section</div>
        </SectionPanel>
      </div>
      <Notification
        className={css`
          width: 31rem;
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
          right: 1rem;
          top: 4.5rem;
          bottom: 0;
          position: absolute;
          @media (max-width: ${mobileMaxWidth}) {
            display: none;
          }
        `}
      />
    </ErrorBoundary>
  );
}
