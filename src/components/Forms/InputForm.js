import React, { useState, useMemo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Textarea from 'components/Texts/Textarea';
import Icon from '../Icon';
import Attachment from 'components/Attachment';
import FullTextReveal from 'components/Texts/FullTextReveal';
import AlertModal from 'components/Modals/AlertModal';
import { Color } from 'constants/css';
import { FILE_UPLOAD_XP_REQUIREMENT, mb } from 'constants/defaultValues';
import {
  addCommasToNumber,
  exceedsCharLimit,
  stringIsEmpty,
  addEmoji,
  finalizeEmoji,
  getFileInfoFromFileName
} from 'helpers/stringHelpers';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';
import { useInputContext } from 'contexts';

InputForm.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  formGroupStyle: PropTypes.object,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  onSubmit: PropTypes.func.isRequired,
  parent: PropTypes.object.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  style: PropTypes.object,
  targetCommentId: PropTypes.number
};

export default function InputForm({
  autoFocus,
  className = '',
  formGroupStyle = {},
  innerRef,
  onSubmit,
  parent,
  placeholder,
  rows,
  style = {},
  targetCommentId
}) {
  const { userId, profileTheme, authLevel, twinkleXP } = useMyState();
  const maxSize = useMemo(
    () =>
      authLevel > 3
        ? 5000 * mb
        : authLevel > 1
        ? 3000 * mb
        : authLevel === 1
        ? 1000 * mb
        : 300 * mb,
    [authLevel]
  );
  const [submitting, setSubmitting] = useState(false);
  const [alertModalShown, setAlertModalShown] = useState(false);
  const FileInputRef = useRef(null);
  const {
    state,
    actions: { onEnterComment, onSetCommentAttachment }
  } = useInputContext();
  const contentType = targetCommentId ? 'comment' : parent.contentType;
  const contentId = targetCommentId || parent.contentId;
  const attachment = state[contentType + contentId]?.attachment;
  const prevText = useMemo(() => state[contentType + contentId]?.text || '', [
    contentId,
    contentType,
    state
  ]);
  const textRef = useRef(prevText);
  const mounted = useRef(true);
  const [text, setText] = useState(prevText);
  const [onHover, setOnHover] = useState(false);

  useEffect(() => {
    if (mounted.current) {
      handleSetText(prevText);
    }
  }, [prevText]);

  const commentExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'comment',
        text
      }),
    [text]
  );

  const disabled = useMemo(
    () => authLevel === 0 && twinkleXP < FILE_UPLOAD_XP_REQUIREMENT,
    [authLevel, twinkleXP]
  );

  useEffect(() => {
    return function saveTextBeforeUnmount() {
      mounted.current = false;
      onEnterComment({
        contentType,
        contentId,
        text: textRef.current
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        ...style
      }}
      className={className}
    >
      <div style={{ width: '100%' }}>
        <div
          style={{
            position: 'relative',
            ...formGroupStyle
          }}
        >
          <Textarea
            autoFocus={autoFocus}
            innerRef={innerRef}
            style={{
              fontSize: '1.7rem',
              ...(commentExceedsCharLimit?.style || {})
            }}
            minRows={rows}
            value={text}
            placeholder={placeholder}
            onChange={handleOnChange}
            onKeyUp={handleKeyUp}
          />
          {commentExceedsCharLimit && (
            <small style={{ color: 'red', fontSize: '1.3rem' }}>
              {commentExceedsCharLimit.message}
            </small>
          )}
        </div>
        {(!stringIsEmpty(text) || attachment) && (
          <div
            className={css`
              display: flex;
              justify-content: flex-end;
            `}
          >
            <Button
              style={{ marginTop: '1rem', marginBottom: '0.5rem' }}
              filled
              color="green"
              disabled={
                submitting ||
                (stringIsEmpty(text) && !attachment) ||
                !!commentExceedsCharLimit
              }
              onClick={handleSubmit}
            >
              Tap This Button to Submit!
            </Button>
          </div>
        )}
      </div>
      {attachment ? (
        <Attachment
          style={{ marginLeft: '1rem', fontSize: '1rem' }}
          attachment={attachment}
          onClose={() =>
            onSetCommentAttachment({
              attachment: undefined,
              contentType,
              contentId
            })
          }
        />
      ) : (
        <div>
          {userId && (
            <Button
              skeuomorphic
              color={profileTheme}
              onClick={() => (disabled ? null : FileInputRef.current.click())}
              onMouseEnter={() => setOnHover(true)}
              onMouseLeave={() => setOnHover(false)}
              style={{
                height: '4rem',
                width: '4rem',
                marginLeft: '1rem',
                opacity: disabled ? 0.2 : 1,
                cursor: disabled ? 'default' : 'pointer',
                boxShadow: disabled ? 'none' : '',
                borderColor: disabled ? Color[profileTheme](0.2) : ''
              }}
            >
              <Icon size="lg" icon="upload" />
            </Button>
          )}
          {userId && disabled && (
            <FullTextReveal
              style={{
                fontSize: '1.3rem',
                marginLeft: '1rem',
                marginTop: '0.5rem'
              }}
              text={
                'Requires ' +
                addCommasToNumber(FILE_UPLOAD_XP_REQUIREMENT) +
                ' XP'
              }
              show={onHover}
            />
          )}
        </div>
      )}
      <input
        ref={FileInputRef}
        style={{ display: 'none' }}
        type="file"
        onChange={handleUpload}
      />
      {alertModalShown && (
        <AlertModal
          title="File is too large"
          content={`The file size is larger than your limit of ${
            maxSize / mb
          } MB`}
          onHide={() => setAlertModalShown(false)}
        />
      )}
    </div>
  );

  function handleKeyUp(event) {
    if (event.key === ' ') {
      handleSetText(addEmoji(event.target.value));
    }
  }

  function handleOnChange(event) {
    handleSetText(event.target.value);
  }

  function handleSetText(text) {
    setText(text);
    textRef.current = text;
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await onSubmit(finalizeEmoji(text));
      if (mounted.current) {
        handleSetText('');
        setSubmitting(false);
      }
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  }

  function handleUpload(event) {
    const fileObj = event.target.files[0];
    if (fileObj.size / mb > maxSize) {
      return setAlertModalShown(true);
    }
    const { fileType } = getFileInfoFromFileName(fileObj.name);
    if (fileType === 'image') {
      const reader = new FileReader();
      reader.onload = (upload) => {
        const payload = upload.target.result;
        if (fileObj.name.split('.')[1] === 'gif') {
          onSetCommentAttachment({
            attachment: {
              file: fileObj,
              contentType: 'file',
              fileType,
              imageUrl: payload
            },
            contentType,
            contentId
          });
        } else {
          window.loadImage(
            payload,
            function (img) {
              const imageUrl = img.toDataURL('image/jpeg');
              const dataUri = imageUrl.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(dataUri, 'base64');
              const file = new File([buffer], fileObj.name);

              onSetCommentAttachment({
                attachment: {
                  file,
                  contentType: 'file',
                  fileType,
                  imageUrl
                },
                contentType,
                contentId
              });
            },
            { orientation: true, canvas: true }
          );
        }
      };
      reader.readAsDataURL(fileObj);
    } else {
      onSetCommentAttachment({
        attachment: {
          file: fileObj,
          contentType: 'file',
          fileType
        },
        contentType,
        contentId
      });
    }
    event.target.value = null;
  }
}
