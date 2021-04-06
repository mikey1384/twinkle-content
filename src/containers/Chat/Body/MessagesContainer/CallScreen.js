import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import ProfilePic from 'components/ProfilePic';
import { useChatContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import { mobileMaxWidth } from 'constants/css';
import { socket } from 'constants/io';
import { css } from '@emotion/css';

CallScreen.propTypes = {
  creatorId: PropTypes.number,
  style: PropTypes.object
};

export default function CallScreen({ creatorId, style }) {
  const {
    state: { channelOnCall, ...state },
    actions: { onSetImLive, onShowIncoming }
  } = useChatContext();
  const { userId } = useMyState();

  const calling = useMemo(() => {
    return !channelOnCall.callReceived && channelOnCall.imCalling;
  }, [channelOnCall.callReceived, channelOnCall.imCalling]);

  const answerButtonShown = useMemo(
    () => !channelOnCall.imCalling && !channelOnCall.incomingShown,
    [channelOnCall.imCalling, channelOnCall.incomingShown]
  );

  const peers = useMemo(() => {
    return Object.keys(channelOnCall.members)?.map((memberId) => {
      return Number(memberId);
    });
  }, [channelOnCall.members]);

  return (
    <div style={{ width: '100%', position: 'relative', zIndex: 5, ...style }}>
      {peers.length > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            paddingTop: '8rem',
            paddingBottom: '7rem'
          }}
        >
          {peers.map((peerId, index) => {
            return (
              <ProfilePic
                key={peerId}
                className={css`
                  height: 10rem;
                  width: 10rem;
                  margin-left: ${index === 0 ? 0 : '1.5rem'};
                  @media (max-width: ${mobileMaxWidth}) {
                    height: 5rem;
                    width: 5rem;
                  }
                `}
                userId={peerId}
                profilePicUrl={state['user' + peerId]?.profilePicUrl}
              />
            );
          })}
        </div>
      )}
      {answerButtonShown && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Button filled color="green">
            <Icon icon="phone-volume" />
            <span style={{ marginLeft: '1rem' }} onClick={handleShowIncoming}>
              Answer
            </span>
          </Button>
        </div>
      )}
      {calling && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          Calling...
        </div>
      )}
    </div>
  );

  function handleShowIncoming() {
    socket.emit('confirm_call_reception', channelOnCall.id);
    if (creatorId === userId && channelOnCall.isClass) {
      onSetImLive(true);
    }
    onShowIncoming();
  }
}
