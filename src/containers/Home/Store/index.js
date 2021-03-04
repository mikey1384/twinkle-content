import React, { useEffect, useRef } from 'react';
import KarmaStatus from './KarmaStatus';
import ItemPanel from './ItemPanel';
import ChangeUsername from './ChangeUsername';
import FileSizeItem from './FileSizeItem';
import ProfilePictureItem from './ProfilePictureItem';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { useAppContext, useContentContext, useViewContext } from 'contexts';
import { priceTable, karmaPointTable } from 'constants/defaultValues';
import { useMyState } from 'helpers/hooks';

export default function Store() {
  const {
    requestHelpers: { loadMyData, unlockUsernameChange }
  } = useAppContext();
  const {
    actions: { onInitContent, onUpdateProfileInfo }
  } = useContentContext();
  const {
    state: { pageVisible }
  } = useViewContext();
  const { canChangeUsername, karmaPoints, userId } = useMyState();
  const mounted = useRef(true);

  useEffect(() => {
    if (userId) {
      init();
    }

    async function init() {
      const data = await loadMyData();
      if (mounted.current) {
        onInitContent({ contentType: 'user', contentId: data.userId, ...data });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageVisible, userId]);

  useEffect(() => {
    mounted.current = true;
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  return (
    <div style={{ paddingBottom: '15rem' }}>
      <div
        className={css`
          margin-bottom: 2rem;
          background: #fff;
          padding: 1rem;
          border: 1px solid ${Color.borderGray()};
          border-radius: ${borderRadius};
          @media (max-width: ${mobileMaxWidth}) {
            border-radius: 0;
            border-top: 0;
            border-left: 0;
            border-right: 0;
          }
        `}
      >
        <p
          className={css`
            font-size: 2rem;
            font-weight: bold;
            font-family: sans-serif, Arial, Helvetica;
            line-height: 1.5;
            color: ${Color.darkerGray()};
            > .logo {
              line-height: 1;
            }
            > .logo-twin {
              color: ${Color.logoBlue()};
            }
            > .logo-kle {
              color: ${Color.logoGreen()};
            }
          `}
          style={{ fontWeight: 'bold', fontSize: '2.5rem' }}
        >
          Welcome to <span className="logo logo-twin">Twin</span>
          <span className="logo logo-kle">kle</span> Store
        </p>
      </div>
      <KarmaStatus />
      <ItemPanel
        karmaPoints={karmaPoints}
        requiredKarmaPoints={karmaPointTable.username}
        locked={!canChangeUsername}
        itemName="Change your username"
        itemDescription={`Unlock this item to change your username anytime you want for ${priceTable.username} Twinkle Coins`}
        onUnlock={handleUnlockUsernameChange}
        style={{ marginTop: userId ? '4rem' : 0 }}
      >
        <ChangeUsername style={{ marginTop: '1rem' }} />
      </ItemPanel>
      <FileSizeItem style={{ marginTop: '3rem' }} />
      <ProfilePictureItem style={{ marginTop: '3rem' }} />
      <ItemPanel
        karmaPoints={karmaPoints}
        requiredKarmaPoints={5000}
        locked
        itemName="Coming soon..."
        style={{ marginTop: '3rem' }}
      />
      <ItemPanel
        karmaPoints={karmaPoints}
        requiredKarmaPoints={10000}
        locked
        itemName="Coming soon..."
        style={{ marginTop: '3rem' }}
      />
    </div>
  );

  async function handleUnlockUsernameChange() {
    const success = await unlockUsernameChange();
    if (success) {
      onUpdateProfileInfo({ userId, canChangeUsername: true });
    }
  }
}
