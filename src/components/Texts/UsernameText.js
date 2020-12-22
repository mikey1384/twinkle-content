import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DropdownList from 'components/DropdownList';
import { Color } from 'constants/css';
import { useHistory } from 'react-router-dom';
import { useMyState, useContentState } from 'helpers/hooks';
import { useAppContext, useChatContext, useContentContext } from 'contexts';
import { isMobile } from 'helpers';
import { addCommasToNumber } from 'helpers/stringHelpers';

UsernameText.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  truncate: PropTypes.bool,
  user: PropTypes.object,
  wordBreakEnabled: PropTypes.bool
};

export default function UsernameText({
  className,
  color,
  style = {},
  user = {},
  truncate = false,
  wordBreakEnabled
}) {
  const history = useHistory();
  const timerRef = useRef(null);
  const {
    requestHelpers: { loadChat, loadDMChannel, loadProfile }
  } = useAppContext();
  const {
    state,
    actions: {
      onInitContent
    }
  } = useContentContext();
  const { userId, username } = useMyState();
  const {
    state: { loaded },
    actions: { onInitChat, onOpenDirectMessageChannel }
  } = useChatContext();
  const [menuShown, setMenuShown] = useState(false);
  const { twinkleXP } = useContentState({
    contentType: 'user',
    contentId: user.id
  });
  useEffect(() => {
    if (loaded && state['user' + user.id] === undefined) {
      init();
    }
    async function init() {
      await initUserData(user.id);
      console.log(state);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, menuShown]);
  return (
    <div
      style={{
        display: 'inline',
        position: 'relative',
        ...style
      }}
      className={className}
      onMouseLeave={() => {
        clearTimeout(timerRef.current);
        setMenuShown(false);
      }}
    >
      <div
        style={{
          display: truncate ? 'block' : 'inline',
          overflowX: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%'
        }}
      >
        <span
          style={{
            width: '100%',
            cursor: 'pointer',
            fontWeight: 'bold',
            ...(wordBreakEnabled
              ? { overflowWrap: 'break-word', wordBreak: 'break-word' }
              : {}),
            color: user.username
              ? color || Color.darkerGray()
              : Color.lighterGray()
          }}
          onClick={onUsernameClick}
          onMouseEnter={onMouseEnter}
        >
          {user.username || '(Deleted)'}
        </span>
      </div>
      {menuShown && (
        <DropdownList style={{ width: '100%' }}>
          <li onClick={() => history.push(`/users/${user.username}`)}>
            <a
              style={{ color: Color.darkerGray(), cursor: 'pointer' }}
              onClick={(e) => e.preventDefault()}
            >
              Profile
            </a>
          </li>
          {user.id !== userId && (
            <li onClick={onLinkClick}>
              <a style={{ color: Color.darkerGray() }}>Talk</a>
            </li>
          )}
          <div
            style={{
              color: Color.darkerGray(), fontSize: '1rem', textAlign: 'center', fontWeight: 'bold'
            }}
          >
            {(twinkleXP === null || twinkleXP === undefined) ? 0 : addCommasToNumber(twinkleXP)} XP
          </div>
        </DropdownList>
      )}
    </div>
  );

  function onMouseEnter() {
    clearTimeout(timerRef.current);
    if (user.username && !isMobile(navigator)) {
      timerRef.current = setTimeout(() => setMenuShown(true), 300);
    }
  }

  async function onLinkClick() {
    setMenuShown(false);
    if (user.id !== userId) {
      if (!loaded) {
        const initialData = await loadChat();
        onInitChat(initialData);
      }
      const data = await loadDMChannel({ recepient: user });
      onOpenDirectMessageChannel({
        user: { id: userId, username },
        recepient: data.partner,
        channelData: data
      });
      history.push('/chat');
    }
  }

  function onUsernameClick() {
    if (user.username) {
      setMenuShown(!menuShown);
    }
  }

  async function initUserData(userId) {
    const data = await loadProfile(userId);
    onInitContent({ contentId: userId, contentType: 'user', ...data });
  }
}
