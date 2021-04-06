import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { useChatContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import { socket } from 'constants/io';

CallScreen.propTypes = {
  creatorId: PropTypes.number,
  style: PropTypes.object
};

export default function CallScreen({ creatorId, style }) {
  const {
    state: { channelOnCall, peerStreams },
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

  return (
    <div style={{ width: '100%', position: 'relative', zIndex: 5, ...style }}>
      {answerButtonShown && (
        <div
          style={{
            width: '100%',
            height: '100%',
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
            height: !channelOnCall.isClass && '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          Calling...
        </div>
      )}
      {channelOnCall.isClass &&
        !calling &&
        !answerButtonShown &&
        Object.keys(peerStreams).length === 0 &&
        creatorId === userId && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold'
            }}
          >{`Show or hide your students using the right menu buttons next to their usernames`}</div>
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
