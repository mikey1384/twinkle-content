import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import ChatSearchBox from './ChatSearchBox';
import Channels from './Channels';
import Vocabulary from './Vocabulary';
import Icon from 'components/Icon';
import Tabs from './Tabs';
import {
  Color,
  desktopMinWidth,
  mobileMaxWidth,
  phoneMaxWidth
} from 'constants/css';
import { css } from '@emotion/css';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useChatContext } from 'contexts';

LeftMenu.propTypes = {
  onNewButtonClick: PropTypes.func.isRequired
};

function LeftMenu({ onNewButtonClick }) {
  const {
    requestHelpers: { loadVocabulary }
  } = useAppContext();
  const {
    state: { loadingVocabulary, chatType },
    actions: { onLoadVocabulary, onSetLoadingVocabulary }
  } = useChatContext();
  const { profileTheme } = useMyState();
  const handleEnterVocabulary = useCallback(async () => {
    onSetLoadingVocabulary(true);
    const { vocabActivities, wordsObj, wordCollectors } =
      await loadVocabulary();
    onLoadVocabulary({ vocabActivities, wordsObj, wordCollectors });
    onSetLoadingVocabulary(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 20vw;
        position: relative;
        background: #fff;
        -webkit-overflow-scrolling: touch;
        @media (max-width: ${phoneMaxWidth}) {
          width: 32vw;
        }
      `}
    >
      <div
        className={`unselectable ${css`
          padding: 1rem;
          background: ${Color[profileTheme](0.8)};
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: background 0.2s;
          @media (max-width: ${mobileMaxWidth}) {
            background: ${Color[profileTheme](1)};
          }
          @media (min-width: ${desktopMinWidth}) {
            &:hover {
              background: ${Color[profileTheme]()};
            }
          }
        `}`}
        onClick={onNewButtonClick}
      >
        <Icon icon="plus" />
        <div
          style={{
            marginLeft: '0.7rem'
          }}
        >
          New Chat
        </div>
      </div>
      <Vocabulary
        selected={chatType === 'vocabulary' || loadingVocabulary}
        onClick={handleEnterVocabulary}
      />
      <ChatSearchBox
        style={{
          marginTop: '1rem',
          padding: '0 1rem',
          zIndex: 5,
          width: '100%'
        }}
      />
      <div style={{ width: '100%', position: 'relative', height: '100%' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }}
        >
          <div style={{ width: '100%', height: '100%', display: 'flex' }}>
            <Tabs />
            <Channels />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(LeftMenu);
