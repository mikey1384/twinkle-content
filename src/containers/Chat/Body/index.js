import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import MessagesContainer from './MessagesContainer';
import Vocabulary from './Vocabulary';
import Loading from 'components/Loading';
import ErrorBoundary from 'components/ErrorBoundary';
import { phoneMaxWidth, Color } from 'constants/css';
import { css } from 'emotion';
import { useChatContext } from 'contexts';

Body.propTypes = {
  channelName: PropTypes.string,
  chessOpponent: PropTypes.object,
  currentChannel: PropTypes.object
};

function Body({ channelName, chessOpponent, currentChannel }) {
  const {
    state: { chatType, loadingVocabulary, selectedChannelId },
    actions: { onSetReplyTarget, onSetIsRespondingToSubject }
  } = useChatContext();

  useEffect(() => {
    onSetReplyTarget(null);
    onSetIsRespondingToSubject(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannelId]);

  return (
    <ErrorBoundary>
      <div
        className={css`
          height: 100%;
          width: 60vw;
          border-left: 1px solid ${Color.borderGray()};
          padding: 0;
          position: relative;
          background: #fff;
          @media (max-width: ${phoneMaxWidth}) {
            width: ${chatType === 'vocabulary' ? '77vw' : '85vw'};
          }
        `}
      >
        {loadingVocabulary ? (
          <Loading text="Loading Vocabulary" />
        ) : (
          <>
            {chatType === 'vocabulary' ? (
              <Vocabulary />
            ) : (
              <MessagesContainer
                channelName={channelName}
                chessOpponent={chessOpponent}
                currentChannel={currentChannel}
              />
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default memo(Body);
