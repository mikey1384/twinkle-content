import React, {
  memo,
  useContext,
  useCallback,
  useEffect,
  useMemo
} from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import EditTextArea from 'components/Texts/EditTextArea';
import ErrorBoundary from 'components/ErrorBoundary';
import LinkAttachment from './LinkAttachment';
import LongText from 'components/Texts/LongText';
import { GENERAL_CHAT_ID } from 'constants/defaultValues';
import { Color, Theme } from 'constants/css';
import { isValidSpoiler, stringIsEmpty } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import { socket } from 'constants/io';
import { isMobile } from 'helpers';
import Spoiler from '../Spoiler';
import LocalContext from '../../Context';

const deviceIsMobile = isMobile(navigator);

TextMessage.propTypes = {
  attachmentHidden: PropTypes.bool,
  channelId: PropTypes.number,
  content: PropTypes.string.isRequired,
  extractedUrl: PropTypes.string,
  isNotification: PropTypes.bool,
  isReloadedSubject: PropTypes.bool,
  isSubject: PropTypes.bool,
  forceRefreshForMobile: PropTypes.func,
  messageId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  MessageStyle: PropTypes.object,
  numMsgs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isEditing: PropTypes.bool,
  onEditCancel: PropTypes.func.isRequired,
  onEditDone: PropTypes.func.isRequired,
  onShowSubjectMsgsModal: PropTypes.func.isRequired,
  socketConnected: PropTypes.bool,
  subjectId: PropTypes.number,
  theme: PropTypes.string,
  thumbUrl: PropTypes.string,
  userCanEditThis: PropTypes.bool
};

function TextMessage({
  attachmentHidden,
  channelId,
  content,
  extractedUrl,
  isNotification,
  isReloadedSubject,
  isSubject,
  forceRefreshForMobile,
  messageId,
  MessageStyle,
  numMsgs,
  isEditing,
  onEditCancel,
  onEditDone,
  subjectId,
  onShowSubjectMsgsModal,
  socketConnected,
  thumbUrl,
  userCanEditThis,
  theme
}) {
  const { profileTheme } = useMyState();
  const defaultTopicColor = useMemo(
    () =>
      Color[
        theme ||
          (channelId === GENERAL_CHAT_ID
            ? Theme(profileTheme).subject.color
            : 'green')
      ](),
    [channelId, profileTheme, theme]
  );

  const {
    requests: { hideChatAttachment },
    actions: { onHideAttachment }
  } = useContext(LocalContext);

  const Prefix = useMemo(() => {
    let prefix = null;
    if (isSubject) {
      prefix = (
        <span
          style={{
            fontWeight: 'bold',
            color: defaultTopicColor
          }}
        >
          Topic:{' '}
        </span>
      );
    }
    if (isReloadedSubject) {
      prefix = (
        <span
          style={{
            fontWeight: 'bold',
            color: defaultTopicColor
          }}
        >
          {'Returning Topic: '}
        </span>
      );
    }
    return prefix;
  }, [defaultTopicColor, isReloadedSubject, isSubject]);

  const handleHideAttachment = useCallback(async () => {
    await hideChatAttachment(messageId);
    onHideAttachment({ messageId, channelId });
    socket.emit('hide_message_attachment', { channelId, messageId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, messageId]);

  useEffect(() => {
    if (deviceIsMobile && isEditing) {
      forceRefreshForMobile?.();
    }
  }, [isEditing, forceRefreshForMobile]);

  const isSpoiler = useMemo(() => isValidSpoiler(content), [content]);

  return (
    <ErrorBoundary componentPath="Message/TextMessage/index">
      <div>
        {isEditing ? (
          <EditTextArea
            allowEmptyText
            contentId={messageId}
            contentType="chat"
            autoFocus
            disabled={!socketConnected}
            rows={2}
            maxRows={deviceIsMobile ? 5 : 10}
            text={content}
            onCancel={onEditCancel}
            onEditDone={onEditDone}
          />
        ) : (
          <>
            <div className={MessageStyle.messageWrapper}>
              {Prefix}
              {isSpoiler ? (
                <Spoiler content={content} />
              ) : stringIsEmpty(content) ? null : (
                <LongText
                  readMoreHeightFixed
                  style={{
                    marginTop: isSubject ? '0.5rem' : 0,
                    marginBottom: isSubject ? '0.5rem' : 0,
                    color: isNotification ? Color.gray() : undefined
                  }}
                >
                  {content}
                </LongText>
              )}
            </div>
            {!!isReloadedSubject && !!numMsgs && numMsgs > 0 && (
              <div className={MessageStyle.relatedConversationsButton}>
                <Button
                  filled
                  color="logoBlue"
                  skeuomorphic
                  onClick={() => onShowSubjectMsgsModal({ subjectId, content })}
                >
                  Show responses
                </Button>
              </div>
            )}
          </>
        )}
        {extractedUrl && messageId && !attachmentHidden && !isSpoiler && (
          <LinkAttachment
            style={{ marginTop: '1rem' }}
            messageId={messageId}
            defaultThumbUrl={thumbUrl}
            extractedUrl={extractedUrl}
            onHideAttachment={handleHideAttachment}
            userCanEditThis={userCanEditThis}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default memo(TextMessage);
