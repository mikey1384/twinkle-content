import React, { useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import {
  addEmoji,
  exceedsCharLimit,
  addCommasToNumber
} from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import { FILE_UPLOAD_XP_REQUIREMENT } from 'constants/defaultValues';
import Icon from 'components/Icon';
import Button from 'components/Button';
import Textarea from 'components/Texts/Textarea';
import FullTextReveal from 'components/Texts/FullTextReveal';

SecretMessageInput.propTypes = {
  secretAnswer: PropTypes.string,
  onSetSecretAnswer: PropTypes.func.isRequired
};

export default function SecretMessageInput({
  secretAnswer,
  onSetSecretAnswer
}) {
  const [onHover, setOnHover] = useState(false);
  const FileInputRef = useRef(null);
  const { authLevel, profileTheme, twinkleXP, userId } = useMyState();
  const secretAnswerExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'subject',
        inputType: 'description',
        text: secretAnswer
      }),
    [secretAnswer]
  );
  const disabled = useMemo(
    () =>
      !userId || (authLevel === 0 && twinkleXP < FILE_UPLOAD_XP_REQUIREMENT),
    [authLevel, twinkleXP, userId]
  );

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <span
        style={{
          fontWeight: 'bold',
          fontSize: '2rem',
          color: Color.darkerGray()
        }}
      >
        Secret Message
      </span>
      <div style={{ width: '100%', display: 'flex' }}>
        <div style={{ flexGrow: 1 }}>
          <Textarea
            autoFocus
            style={{
              marginTop: '0.5rem',
              ...(secretAnswerExceedsCharLimit || null)
            }}
            value={secretAnswer}
            minRows={4}
            placeholder="Enter the Secret Message"
            onChange={(event) =>
              onSetSecretAnswer(addEmoji(event.target.value))
            }
            onKeyUp={(event) => {
              if (event.key === ' ') {
                onSetSecretAnswer(addEmoji(event.target.value));
              }
            }}
          />
          {secretAnswerExceedsCharLimit && (
            <small style={{ color: 'red' }}>
              {secretAnswerExceedsCharLimit.message}
            </small>
          )}
        </div>
        <div style={{ marginLeft: '1rem' }}>
          <Button
            skeuomorphic
            disabled={disabled}
            color={profileTheme}
            onClick={() => FileInputRef.current.click()}
            onMouseEnter={() => setOnHover(true)}
            onMouseLeave={() => setOnHover(false)}
          >
            <Icon size="lg" icon="upload" />
          </Button>
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
      </div>
      <input
        ref={FileInputRef}
        style={{ display: 'none' }}
        type="file"
        onChange={handleUpload}
      />
    </div>
  );

  function handleUpload(event) {
    console.log(event);
    /*
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
    */
  }
}
