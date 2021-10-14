import React, { memo } from 'react';
import PropTypes from 'prop-types';
import MessagesContainer from './MessagesContainer';
import Vocabulary from './Vocabulary';
import Loading from 'components/Loading';
import ErrorBoundary from 'components/ErrorBoundary';
import { phoneMaxWidth, Color } from 'constants/css';
import { css } from '@emotion/css';
import { useChatContext } from 'contexts';

Body.propTypes = {
  channelName: PropTypes.string,
  chessOpponent: PropTypes.object,
  currentChannel: PropTypes.object,
  onChannelEnter: PropTypes.func
};

function Body({ channelName, chessOpponent, currentChannel, onChannelEnter }) {
  const {
    state: { chatType, loadingVocabulary }
  } = useChatContext();

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
                onChannelEnter={onChannelEnter}
              />
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default memo(Body);
