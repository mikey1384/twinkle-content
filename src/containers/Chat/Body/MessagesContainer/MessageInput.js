import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import PropTypes from 'prop-types';
import Textarea from 'components/Texts/Textarea';
import Button from 'components/Button';
import Icon from 'components/Icon';
import TargetMessagePreview from './TargetMessagePreview';
import TargetSubjectPreview from './TargetSubjectPreview';
import UploadModal from '../../Modals/UploadModal';
import AddButtons from './AddButtons';
import AlertModal from 'components/Modals/AlertModal';
import Loading from 'components/Loading';
import { isMobile } from 'helpers';
import {
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  exceedsCharLimit
} from 'helpers/stringHelpers';
import {
  mb,
  returnMaxUploadSize,
  GENERAL_CHAT_ID
} from 'constants/defaultValues';
import { useKeyContext } from 'contexts';
import LocalContext from '../../Context';
import localize from 'constants/localize';

const enterMessageLabel = localize('enterMessage');

MessageInput.propTypes = {
  selectedChannelId: PropTypes.number,
  innerRef: PropTypes.object,
  inputText: PropTypes.string,
  isRespondingToSubject: PropTypes.bool,
  isTwoPeopleChannel: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  loading: PropTypes.bool,
  onChessButtonClick: PropTypes.func.isRequired,
  onWordleButtonClick: PropTypes.func.isRequired,
  onHeightChange: PropTypes.func.isRequired,
  onMessageSubmit: PropTypes.func.isRequired,
  onSelectVideoButtonClick: PropTypes.func.isRequired,
  onSetInputText: PropTypes.func.isRequired,
  replyTarget: PropTypes.object,
  recepientId: PropTypes.number,
  socketConnected: PropTypes.bool,
  subjectId: PropTypes.number,
  textForThisChannel: PropTypes.string
};

const deviceIsMobile = isMobile(navigator);

function MessageInput({
  selectedChannelId = 0,
  innerRef,
  inputText,
  isRespondingToSubject,
  isTwoPeopleChannel,
  loading,
  onChessButtonClick,
  onWordleButtonClick,
  onHeightChange,
  onMessageSubmit,
  onSelectVideoButtonClick,
  onSetInputText,
  replyTarget,
  recepientId,
  socketConnected,
  subjectId,
  textForThisChannel
}) {
  const { banned, fileUploadLvl } = useKeyContext((v) => v.myState);
  const {
    button: { color: buttonColor },
    buttonHovered: { color: buttonHoverColor }
  } = useKeyContext((v) => v.theme);
  const {
    actions: { onEnterComment, onSetIsRespondingToSubject, onSetReplyTarget }
  } = useContext(LocalContext);
  const FileInputRef = useRef(null);
  const prevChannelId = useRef(selectedChannelId);
  const maxSize = useMemo(
    () => returnMaxUploadSize(fileUploadLvl),
    [fileUploadLvl]
  );
  const textRef = useRef(textForThisChannel);
  const inputCoolingDown = useRef(false);
  const timerRef = useRef(null);
  const [alertModalShown, setAlertModalShown] = useState(false);
  const [fileObj, setFileObj] = useState(null);
  const [uploadModalShown, setUploadModalShown] = useState(false);
  const [coolingDown, setCoolingDown] = useState(false);
  const textIsEmpty = useMemo(() => stringIsEmpty(inputText), [inputText]);

  useEffect(() => {
    if (prevChannelId !== selectedChannelId) {
      onEnterComment({
        contentType: 'chat',
        contentId: prevChannelId.current,
        text: textRef.current
      });
      handleSetText('');
    }
    prevChannelId.current = selectedChannelId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChannelId]);

  useEffect(() => {
    handleSetText(textForThisChannel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textForThisChannel]);

  useEffect(() => {
    const inputHeight = innerRef.current?.clientHeight;
    if (!loading) {
      onHeightChange(inputHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [innerRef, loading]);

  useEffect(() => {
    if (!deviceIsMobile) {
      innerRef.current.focus();
    }
  }, [selectedChannelId, innerRef]);

  const messageExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        inputType: 'message',
        contentType: 'chat',
        text: inputText
      }),
    [inputText]
  );

  useEffect(() => {
    return function saveTextBeforeUnmount() {
      onEnterComment({
        contentType: 'chat',
        contentId: prevChannelId.current,
        text: textRef.current
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMsg = useCallback(async () => {
    if (!socketConnected || inputCoolingDown.current) {
      if (inputCoolingDown.current) {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setCoolingDown(false);
          inputCoolingDown.current = false;
        }, 700);
      }
      return;
    }
    setCoolingDown(true);
    inputCoolingDown.current = true;
    timerRef.current = setTimeout(() => {
      setCoolingDown(false);
      inputCoolingDown.current = false;
    }, 500);
    if (banned?.chat) {
      return;
    }
    innerRef.current.focus();
    if (stringIsEmpty(inputText)) return;
    try {
      if (selectedChannelId === 0) {
        handleSetText('');
      }
      await onMessageSubmit(finalizeEmoji(inputText));
      handleSetText('');
      onEnterComment({
        contentType: 'chat',
        contentId: selectedChannelId,
        text: ''
      });
    } catch (error) {
      console.error(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    banned?.chat,
    selectedChannelId,
    innerRef,
    onEnterComment,
    onMessageSubmit,
    socketConnected,
    inputText
  ]);

  const handleSetText = (newText) => {
    onSetInputText(newText);
    textRef.current = newText;
  };

  const handleKeyDown = useCallback(
    (event) => {
      const shiftKeyPressed = event.shiftKey;
      const enterKeyPressed = event.keyCode === 13;
      if (
        enterKeyPressed &&
        !deviceIsMobile &&
        !shiftKeyPressed &&
        !messageExceedsCharLimit &&
        !loading
      ) {
        event.preventDefault();
        handleSendMsg();
      }
      if (enterKeyPressed && shiftKeyPressed) {
        onHeightChange(innerRef.current?.clientHeight + 20);
      }
    },
    [handleSendMsg, innerRef, loading, messageExceedsCharLimit, onHeightChange]
  );

  const handleImagePaste = useCallback(
    (file) => {
      if (file.size / mb > maxSize) {
        return setAlertModalShown(true);
      }
      setFileObj(file);
      setUploadModalShown(true);
    },
    [maxSize]
  );

  const handleUpload = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file.size / mb > maxSize) {
        return setAlertModalShown(true);
      }
      setFileObj(file);
      setUploadModalShown(true);
      event.target.value = null;
    },
    [maxSize]
  );

  const handleChange = useCallback(
    (event) => {
      setTimeout(() => {
        onHeightChange(innerRef.current?.clientHeight);
      }, 0);
      handleSetText(event.target.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [innerRef, onHeightChange]
  );

  const handlePaste = useCallback(
    (event) => {
      const { items } = event.clipboardData;
      for (let i = 0; i < items.length; i++) {
        if (!items[i].type.includes('image')) continue;
        handleImagePaste(items[i].getAsFile());
      }
    },
    [handleImagePaste]
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {isRespondingToSubject ? (
        <TargetSubjectPreview
          channelId={selectedChannelId}
          onClose={() =>
            onSetIsRespondingToSubject({
              channelId: selectedChannelId,
              isResponding: false
            })
          }
        />
      ) : replyTarget ? (
        <TargetMessagePreview
          replyTarget={replyTarget}
          onClose={() =>
            onSetReplyTarget({ channelId: selectedChannelId, target: null })
          }
        />
      ) : null}
      <div style={{ display: 'flex' }}>
        <div
          style={{
            margin: '0.2rem 1rem 0.2rem 0',
            height: '100%'
          }}
        >
          {isTwoPeopleChannel ? (
            <Button
              disabled={loading || banned?.chess}
              skeuomorphic
              onClick={onChessButtonClick}
              color={buttonColor}
              hoverColor={buttonHoverColor}
            >
              <Icon size="lg" icon={['fas', 'chess']} />
              <span className="desktop" style={{ marginLeft: '0.7rem' }}>
                Chess
              </span>
            </Button>
          ) : selectedChannelId === GENERAL_CHAT_ID ? (
            <Button
              disabled={loading}
              skeuomorphic
              onClick={onWordleButtonClick}
              color={buttonColor}
              hoverColor={buttonHoverColor}
            >
              W<span className="desktop">ordle</span>
            </Button>
          ) : null}
        </div>
        <Textarea
          innerRef={innerRef}
          minRows={1}
          placeholder={`${enterMessageLabel}...`}
          onKeyDown={handleKeyDown}
          value={inputText}
          onChange={handleChange}
          onKeyUp={(event) => {
            if (event.key === ' ') {
              handleSetText(addEmoji(event.target.value));
            }
          }}
          onPaste={handlePaste}
          style={{
            marginRight: '1rem',
            ...(messageExceedsCharLimit?.style || {})
          }}
        />
        {!textIsEmpty && (
          <div
            style={{
              margin: `0.2rem 1rem 0.2rem 0`
            }}
          >
            <Button
              filled
              disabled={loading || !socketConnected || coolingDown}
              color={buttonColor}
              hoverColor={buttonHoverColor}
              onClick={handleSendMsg}
            >
              <Icon size="lg" icon="paper-plane" />
            </Button>
          </div>
        )}
        <AddButtons
          disabled={loading || !!banned?.chat || !socketConnected}
          onUploadButtonClick={() => FileInputRef.current.click()}
          onSelectVideoButtonClick={onSelectVideoButtonClick}
        />
        {!socketConnected && (
          <Loading
            style={{
              height: 0,
              width: 0,
              position: 'absolute',
              right: '7rem',
              bottom: '3.2rem'
            }}
          />
        )}
        <input
          ref={FileInputRef}
          style={{ display: 'none' }}
          type="file"
          onChange={handleUpload}
        />
      </div>
      {alertModalShown && (
        <AlertModal
          title="File is too large"
          content={`The file size is larger than your limit of ${
            maxSize / mb
          } MB`}
          onHide={() => setAlertModalShown(false)}
        />
      )}
      {uploadModalShown && (
        <UploadModal
          initialCaption={inputText}
          recepientId={recepientId}
          subjectId={subjectId}
          channelId={selectedChannelId}
          fileObj={fileObj}
          onUpload={() => {
            handleSetText('');
            setUploadModalShown(false);
          }}
          replyTarget={replyTarget}
          onHide={() => setUploadModalShown(false)}
        />
      )}
    </div>
  );
}

export default memo(MessageInput);
