import React, { memo, useEffect, useRef, useMemo, useState } from 'react';
import { useInterval } from 'helpers/hooks';
import PropTypes from 'prop-types';
import UsernameText from 'components/Texts/UsernameText';
import Button from 'components/Button';
import RoundList from 'components/RoundList';
import Icon from 'components/Icon';
import { timeSince } from 'helpers/timeStampHelpers';
import { Color } from 'constants/css';
import { css } from '@emotion/css';
import { useHistory } from 'react-router-dom';
import { useAppContext, useChatContext } from 'contexts';
import { GENERAL_CHAT_ID } from 'constants/defaultValues';

ChatFeeds.propTypes = {
  content: PropTypes.string,
  myId: PropTypes.number,
  reloadedBy: PropTypes.number,
  reloaderName: PropTypes.string,
  reloadTimeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userId: PropTypes.number,
  username: PropTypes.string
};

function ChatFeeds({
  content,
  myId,
  reloadedBy,
  reloaderName,
  reloadTimeStamp,
  style = {},
  timeStamp,
  userId,
  username
}) {
  const mounted = useRef(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const history = useHistory();
  const {
    requestHelpers: { loadChat, loadChatChannel }
  } = useAppContext();
  const {
    state: { loaded },
    actions: { onEnterChannelWithId, onInitChat }
  } = useChatContext();
  const [timeSincePost, setTimeSincePost] = useState(timeSince(timeStamp));
  const [timeSinceReload, setTimeSinceReload] = useState(
    timeSince(reloadTimeStamp)
  );
  useInterval(() => {
    setTimeSincePost(timeSince(timeStamp));
    setTimeSinceReload(timeSince(reloadTimeStamp));
  }, 1000);
  const Details = useMemo(() => {
    const posterString = (
      <>
        Started by <UsernameText user={{ id: userId, username }} />
        {timeStamp ? ` ${timeSincePost}` : ''}
      </>
    );
    const reloaderString = (
      <div style={{ marginTop: '0.5rem' }}>
        Brought back by{' '}
        <UsernameText user={{ id: reloadedBy, username: reloaderName }} />
        {reloadTimeStamp ? ` ${timeSinceReload}` : ''}
      </div>
    );

    return (
      <div style={{ margin: '0.5rem 0 1.5rem 0' }}>
        <div>{userId ? posterString : 'Join the conversation!'}</div>
        {reloadedBy && reloaderString}
      </div>
    );
  }, [
    reloadTimeStamp,
    reloadedBy,
    reloaderName,
    timeSincePost,
    timeSinceReload,
    timeStamp,
    userId,
    username
  ]);

  useEffect(() => {
    mounted.current = true;
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  return (
    <RoundList
      style={{
        textAlign: 'center',
        marginTop: '0',
        ...style
      }}
    >
      <nav
        style={{
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        className={css`
          background: #fff;
          &:hover {
            transition: background 0.5s;
            background: ${Color.highlightGray()};
          }
        `}
      >
        <p
          style={{
            fontWeight: 'bold',
            fontSize: '2rem',
            color: Color.darkerGray()
          }}
        >
          {content}
        </p>
        <span style={{ color: Color.darkerGray() }}>{Details}</span>
        <Button
          disabled={loadingChat}
          skeuomorphic
          color="darkerGray"
          onClick={initChatFromThis}
        >
          <Icon icon="comments" />
          <span style={{ marginLeft: '1rem' }}>Join Conversation</span>
          {loadingChat && (
            <Icon style={{ marginLeft: '0.7rem' }} icon="spinner" pulse />
          )}
        </Button>
      </nav>
    </RoundList>
  );

  async function initChatFromThis() {
    if (myId) {
      setLoadingChat(true);
      if (!loaded) {
        const data = await loadChat({ channelId: GENERAL_CHAT_ID });
        if (mounted.current) {
          onInitChat(data);
        }
      } else {
        const data = await loadChatChannel({ channelId: GENERAL_CHAT_ID });
        if (mounted.current) {
          onEnterChannelWithId({ data });
        }
      }
    }
    history.push('/chat');
  }
}

export default memo(ChatFeeds);
