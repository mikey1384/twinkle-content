import React from 'react';
import ErrorBoundary from 'components/ErrorBoundary';
import ShopPanel from './ShopPanel';
import Notification from 'components/Notification';
import Icon from 'components/Icon';
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
        <ShopPanel title="Tier 1" style={{ marginBottom: '1rem' }} loaded>
          <div>This is my section</div>
        </ShopPanel>
        <ShopPanel loaded title="Tier 2">
          <div>
            <Icon icon="lock" />
          </div>
        </ShopPanel>
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
