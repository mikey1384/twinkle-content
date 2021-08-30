import React, { useEffect, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import TextEditSection from './TextEditSection';
import { useInputContext } from 'contexts';
import { css } from '@emotion/css';
import {
  addEmoji,
  exceedsCharLimit,
  finalizeEmoji,
  stringIsEmpty,
  isValidUrl,
  isValidYoutubeUrl
} from 'helpers/stringHelpers';
import AttachmentEditSection from './AttachmentEditSection';

ContentEditor.propTypes = {
  comment: PropTypes.string,
  content: PropTypes.string,
  contentId: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  description: PropTypes.string,
  filePath: PropTypes.string,
  onDismiss: PropTypes.func.isRequired,
  onEditContent: PropTypes.func.isRequired,
  secretAnswer: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.string
};

export default function ContentEditor({
  comment,
  content,
  contentId,
  contentType,
  description,
  filePath,
  onDismiss,
  onEditContent,
  secretAnswer = '',
  style,
  title
}) {
  const defaultInputState = useMemo(
    () => ({
      editedContent: content || '',
      editedComment: comment || '',
      editedDescription: description || '',
      editedSecretAnswer: secretAnswer || '',
      editedTitle: title || '',
      editedUrl:
        contentType === 'video'
          ? `https://www.youtube.com/watch?v=${content}`
          : contentType === 'url'
          ? content
          : ''
    }),
    [comment, content, contentType, description, secretAnswer, title]
  );
  const {
    state,
    actions: { onSetEditForm }
  } = useInputContext();
  const prevInputState = useMemo(
    () => state['edit' + contentType + contentId],
    [contentId, contentType, state]
  );
  const inputStateRef = useRef(prevInputState || defaultInputState);
  const [inputState, setInputState] = useState(
    prevInputState || defaultInputState
  );
  useEffect(() => {
    handleSetInputState(prevInputState || defaultInputState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevInputState]);

  const editForm = useMemo(() => inputState || {}, [inputState]);
  const {
    editedContent = '',
    editedComment = '',
    editedDescription = '',
    editedSecretAnswer = '',
    editedTitle = '',
    editedUrl = ''
  } = editForm;
  const descriptionExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType,
        inputType: 'description',
        text: contentType === 'comment' ? editedComment : editedDescription
      }),
    [contentType, editedComment, editedDescription]
  );
  const secretAnswerExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        inputType: 'description',
        contentType,
        text: editedSecretAnswer
      }),
    [contentType, editedSecretAnswer]
  );
  const titleExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType,
        inputType: 'title',
        text: editedTitle
      }),
    [contentType, editedTitle]
  );
  const urlExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType,
        inputType: 'url',
        text: editedUrl
      }),
    [contentType, editedUrl]
  );
  const editButtonDisabled = useMemo(() => {
    const contentUrl =
      contentType === 'video'
        ? `https://www.youtube.com/watch?v=${content}`
        : content;
    const isValid =
      contentType === 'video'
        ? isValidYoutubeUrl(editedUrl)
        : isValidUrl(editedUrl);
    if (titleExceedsCharLimit) {
      return true;
    }
    if (descriptionExceedsCharLimit) {
      return true;
    }
    if (secretAnswerExceedsCharLimit) {
      return true;
    }
    if (
      (contentType === 'video' || contentType === 'url') &&
      urlExceedsCharLimit
    ) {
      return true;
    }

    switch (contentType) {
      case 'video':
      case 'url':
        if (
          stringIsEmpty(editedUrl) ||
          stringIsEmpty(editedTitle) ||
          !isValid
        ) {
          return true;
        }
        if (
          editedUrl === contentUrl &&
          editedTitle === title &&
          editedDescription === description
        ) {
          return true;
        }
        return false;
      case 'comment':
        if (
          (stringIsEmpty(editedComment) || editedComment === comment) &&
          !filePath
        ) {
          return true;
        }
        return false;
      case 'subject':
        if (
          stringIsEmpty(editedTitle) ||
          (editedTitle === title &&
            editedDescription === description &&
            editedSecretAnswer === secretAnswer)
        ) {
          return true;
        }
        return false;
      default:
        return true;
    }
  }, [
    comment,
    content,
    contentType,
    description,
    descriptionExceedsCharLimit,
    editedComment,
    editedDescription,
    editedSecretAnswer,
    editedTitle,
    editedUrl,
    filePath,
    secretAnswer,
    secretAnswerExceedsCharLimit,
    title,
    titleExceedsCharLimit,
    urlExceedsCharLimit
  ]);

  useEffect(() => {
    return function saveInputStateBeforeUnmount() {
      onSetEditForm({
        contentId,
        contentType,
        form: inputStateRef.current
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId, contentType]);

  return (
    <div
      style={style}
      className={css`
        small {
          font-size: 1.3rem;
          line-height: 2.5rem;
        }
      `}
    >
      <form onSubmit={handleSubmit}>
        {contentType === 'subject' && <AttachmentEditSection />}
        <TextEditSection
          editedComment={editedComment}
          editedDescription={editedDescription}
          editedSecretAnswer={editedSecretAnswer}
          editedUrl={editedUrl}
          editedTitle={editedTitle}
          contentType={contentType}
          descriptionExceedsCharLimit={descriptionExceedsCharLimit}
          urlExceedsCharLimit={urlExceedsCharLimit}
          secretAnswerExceedsCharLimit={secretAnswerExceedsCharLimit}
          titleExceedsCharLimit={titleExceedsCharLimit}
          onSecretAnswerChange={(event) => {
            const { value } = event.target;
            handleSetInputState({
              ...editForm,
              editedSecretAnswer: value
            });
          }}
          onTextAreaChange={(event) => {
            const { value } = event.target;
            handleSetInputState({
              ...editForm,
              [contentType === 'comment'
                ? 'editedComment'
                : 'editedDescription']: value
            });
          }}
          onTextAreaKeyUp={(event) => {
            const { value } = event.target;
            handleSetInputState({
              ...editForm,
              [contentType === 'comment'
                ? 'editedComment'
                : 'editedDescription']: addEmoji(value)
            });
          }}
          onTitleChange={(text) =>
            handleSetInputState({
              ...editForm,
              editedTitle: text
            })
          }
          onTitleKeyUp={(event) =>
            handleSetInputState({
              ...editForm,
              editedTitle: addEmoji(event.target.value)
            })
          }
          onUrlChange={(url) =>
            handleSetInputState({
              ...editForm,
              editedUrl: url
            })
          }
        />
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            flexDirection: 'row-reverse'
          }}
        >
          <Button color="blue" type="submit" disabled={editButtonDisabled}>
            Done
          </Button>
          <Button
            transparent
            style={{ marginRight: '1rem' }}
            onClick={handleDismiss}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );

  function handleDismiss() {
    handleSetInputState(null);
    onDismiss();
  }

  function handleSetInputState(newState) {
    setInputState(newState);
    inputStateRef.current = newState;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const post = {
      ...editForm,
      editedComment: finalizeEmoji(editedComment),
      editedContent: finalizeEmoji(editedContent),
      editedDescription: finalizeEmoji(editedDescription),
      editedSecretAnswer: finalizeEmoji(editedSecretAnswer),
      editedTitle: finalizeEmoji(editedTitle)
    };
    await onEditContent({ ...post, contentId, contentType });
    handleDismiss();
  }
}
