import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import DropdownList from 'components/DropdownList';
import { Color } from 'constants/css';
import { useHistory } from 'react-router-dom';
import { useContentState, useMyState } from 'helpers/hooks';
import { useAppContext, useContentContext, useChatContext } from 'contexts';
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
  const mouseEntered = useRef(false);
  const {
    requestHelpers: { loadChat, loadDMChannel, loadProfile }
  } = useAppContext();
  const {
    actions: { onInitContent }
  } = useContentContext();
  const { twinkleXP } = useContentState({
    contentType: 'user',
    contentId: user.id
  });
  const { userId, username } = useMyState();
  const {
    state: { loaded },
    actions: { onInitChat, onOpenDirectMessageChannel }
  } = useChatContext();
  const [menuShown, setMenuShown] = useState(false);
  const userXP = useMemo(() => {
    if (!twinkleXP && !user.twinkleXP) {
      return null;
    }
    return addCommasToNumber(twinkleXP || user.twinkleXP);
  }, [twinkleXP, user.twinkleXP]);

  return (
    <div
      style={{
        display: 'inline',
        position: 'relative',
        ...style
      }}
      className={className}
      onMouseLeave={() => {
        mouseEntered.current = false;
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
          {userXP && (
            <li
              style={{
                padding: '5px',
                background: Color.highlightGray(),
                color: Color.darkerGray(),
                fontSize: '1rem',
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            >
              {userXP} XP
            </li>
          )}
        </DropdownList>
      )}
    </div>
  );

  async function onMouseEnter() {
    mouseEntered.current = true;
    clearTimeout(timerRef.current);
    if (user.username && !isMobile(navigator)) {
      if (!twinkleXP && !user.twinkleXP) {
        timerRef.current = setTimeout(async () => {
          const data = await loadProfile(user.id);
          if (mouseEntered.current) {
            onInitContent({ contentId: user.id, contentType: 'user', ...data });
            setMenuShown(true);
          }
        }, 200);
      } else {
        timerRef.current = setTimeout(() => setMenuShown(true), 300);
      }
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

  async function onUsernameClick() {
    if (user.username) {
      if (!twinkleXP && !user.twinkleXP && !menuShown) {
        const data = await loadProfile(user.id);
        onInitContent({ contentId: user.id, contentType: 'user', ...data });
        setMenuShown(true);
      } else {
        setMenuShown(!menuShown);
      }
    }
  }
}
