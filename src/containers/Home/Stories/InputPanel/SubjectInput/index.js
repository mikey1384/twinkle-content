import React, {
  useContext,
  memo,
  useMemo,
  useRef,
  useState,
  useEffect
} from 'react';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import Textarea from 'components/Texts/Textarea';
import AttachContentModal from './AttachContentModal';
import Attachment from 'components/Attachment';
import ErrorBoundary from 'components/ErrorBoundary';
import LocalContext from '../../../Context';
import {
  addEmoji,
  exceedsCharLimit,
  stringIsEmpty,
  finalizeEmoji
} from 'helpers/stringHelpers';
import { v1 as uuidv1 } from 'uuid';
import SwitchButton from 'components/Buttons/SwitchButton';
import RewardLevelForm from 'components/Forms/RewardLevelForm';
import Icon from 'components/Icon';
import FileUploadStatusIndicator from 'components/FileUploadStatusIndicator';
import SecretMessageInput from 'components/Forms/SecretMessageInput';
import { Color } from 'constants/css';
import { PanelStyle } from '../Styles';
import { charLimit } from 'constants/defaultValues';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useHomeContext, useInputContext } from 'contexts';

function SubjectInput() {
  const { onFileUpload } = useContext(LocalContext);
  const {
    requestHelpers: { uploadContent }
  } = useAppContext();
  const { canEditRewardLevel, profileTheme } = useMyState();
  const {
    state: {
      fileUploadComplete,
      fileUploadProgress,
      secretAttachmentUploadComplete,
      secretAttachmentUploadProgress,
      submittingSubject,
      uploadingFile
    },
    actions: { onLoadNewFeeds, onSetSubmittingSubject, onSetUploadingFile }
  } = useHomeContext();
  const {
    state: { subject },
    actions: {
      onSetHasSecretAnswer,
      onResetSubjectInput,
      onSetSecretAnswer,
      onSetSecretAttachment,
      onSetSubjectAttachment,
      onSetSubjectDescription,
      onSetSubjectDescriptionFieldShown,
      onSetSubjectRewardLevel,
      onSetSubjectTitle
    }
  } = useInputContext();
  const {
    details,
    details: { attachment, rewardLevel, secretAttachment }
  } = subject;
  const [attachContentModalShown, setAttachContentModalShown] = useState(false);
  const titleRef = useRef(details.title);
  const [title, setTitle] = useState(details.title);
  const descriptionRef = useRef(details.description);
  const [description, setDescription] = useState(details.description);
  const descriptionFieldShownRef = useRef(subject.descriptionFieldShown);
  const [descriptionFieldShown, setDescriptionFieldShown] = useState(
    subject.descriptionFieldShown
  );
  const secretAnswerRef = useRef(details.secretAnswer);
  const [secretAnswer, setSecretAnswer] = useState(details.secretAnswer);
  const hasSecretAnswerRef = useRef(subject.hasSecretAnswer);
  const [hasSecretAnswer, setHasSecretAnswer] = useState(
    subject.hasSecretAnswer
  );

  const titleExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        inputType: 'title',
        contentType: 'subject',
        text: title
      }),
    [title]
  );

  const descriptionExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'subject',
        inputType: 'description',
        text: description
      }),
    [description]
  );

  const buttonDisabled = useMemo(() => {
    if (title.length > charLimit.subject.title) return true;
    if (description.length > charLimit.subject.description) return true;
    if (
      (hasSecretAnswer && stringIsEmpty(secretAnswer) && !secretAttachment) ||
      secretAnswer.length > charLimit.subject.description
    ) {
      return true;
    }
    return false;
  }, [
    description.length,
    hasSecretAnswer,
    secretAnswer,
    secretAttachment,
    title.length
  ]);

  useEffect(() => {
    return function setTextsBeforeUnmount() {
      onSetSubjectDescriptionFieldShown(descriptionFieldShownRef.current);
      onSetSubjectTitle(titleRef.current);
      onSetSubjectDescription(descriptionRef.current);
      onSetHasSecretAnswer(hasSecretAnswerRef.current);
      onSetSecretAnswer(secretAnswerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary className={PanelStyle}>
      {!uploadingFile && (
        <>
          <p>Post a subject Twinkle users can talk about</p>
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ width: '100%' }}>
              <Input
                placeholder="A subject Twinkle users can talk about"
                value={title}
                onChange={handleInputChange}
                onKeyUp={(event) => {
                  handleSetTitle(addEmoji(event.target.value));
                }}
                style={titleExceedsCharLimit?.style}
              />
            </div>
            <div style={{ marginLeft: '1rem' }}>
              {attachment ? (
                <Attachment
                  attachment={attachment}
                  onClose={() => onSetSubjectAttachment(undefined)}
                />
              ) : (
                <Button
                  skeuomorphic
                  color={profileTheme}
                  onClick={() => setAttachContentModalShown(true)}
                >
                  <Icon size="lg" icon="plus" />
                </Button>
              )}
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <span
              style={{
                fontSize: '1.2rem',
                color:
                  title.length > charLimit.subject.title
                    ? 'red'
                    : Color.darkerGray()
              }}
            >
              {titleExceedsCharLimit?.message}
            </span>
          </div>
          {descriptionFieldShown && (
            <div style={{ position: 'relative' }}>
              <Textarea
                style={{
                  marginTop: '1rem',
                  ...(descriptionExceedsCharLimit?.style || null)
                }}
                value={description}
                minRows={4}
                placeholder="Enter Description (Optional, you don't need to write this)"
                onChange={(event) =>
                  handleSetDescription(addEmoji(event.target.value))
                }
                onKeyUp={(event) => {
                  if (event.key === ' ') {
                    handleSetDescription(addEmoji(event.target.value));
                  }
                }}
              />
              {descriptionExceedsCharLimit && (
                <small style={{ color: 'red' }}>
                  {descriptionExceedsCharLimit.message}
                </small>
              )}
              {hasSecretAnswer && (
                <SecretMessageInput
                  secretAnswer={secretAnswer}
                  secretAttachment={secretAttachment}
                  onSetSecretAnswer={handleSetSecretAnswer}
                  onSetSecretAttachment={onSetSecretAttachment}
                />
              )}
              {canEditRewardLevel && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '1.5rem' }}>
                    For every star you add, the amount of maximum XP you and
                    other moderators could reward the participants of this
                    subject rises by 1,000 XP.
                  </div>
                  <RewardLevelForm
                    themed
                    style={{
                      marginTop: '1rem',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      flexDirection: 'column',
                      padding: '1rem',
                      fontSize: '3rem'
                    }}
                    rewardLevel={rewardLevel}
                    onSetRewardLevel={onSetSubjectRewardLevel}
                  />
                </div>
              )}
              <div style={{ marginTop: '1rem' }} className="button-container">
                <SwitchButton
                  checked={hasSecretAnswer}
                  label="Secret Message"
                  onChange={() => handleSetHasSecretAnswer(!hasSecretAnswer)}
                  style={{ marginRight: '1rem' }}
                />
                <Button
                  filled
                  color="green"
                  type="submit"
                  disabled={submittingSubject || buttonDisabled}
                  onClick={handleSubmit}
                >
                  Post!
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      {uploadingFile && attachment?.contentType === 'file' && (
        <FileUploadStatusIndicator
          style={{ fontSize: '1.7rem', fontWeight: 'bold', marginTop: 0 }}
          fileName={attachment?.file?.name}
          uploadComplete={fileUploadComplete}
          uploadProgress={fileUploadProgress}
        />
      )}
      {uploadingFile && secretAttachment?.file && (
        <FileUploadStatusIndicator
          style={{
            fontSize: '1.7rem',
            fontWeight: 'bold',
            marginTop: attachment?.contentType === 'file' ? '1.5rem' : 0
          }}
          fileName={secretAttachment?.file?.name}
          uploadComplete={secretAttachmentUploadComplete}
          uploadProgress={secretAttachmentUploadProgress}
        />
      )}
      {attachContentModalShown && (
        <AttachContentModal
          onHide={() => setAttachContentModalShown(false)}
          onConfirm={(content) => {
            onSetSubjectAttachment(content);
            setAttachContentModalShown(false);
          }}
        />
      )}
    </ErrorBoundary>
  );

  function handleFileUpload({
    attachment,
    description,
    hasSecretAnswer,
    rewardLevel,
    secretAnswer,
    secretAttachment,
    title
  }) {
    onSetUploadingFile(true);
    onFileUpload({
      attachment,
      description,
      hasSecretAnswer,
      rewardLevel,
      secretAnswer,
      secretAttachment,
      title,
      filePath: uuidv1(),
      file: attachment?.file
    });
  }

  function handleInputChange(text) {
    handleSetTitle(text);
    handleSetDescriptionFieldShown(!!text.length);
    if (!text.length) {
      handleSetHasSecretAnswer(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (
      stringIsEmpty(title) ||
      title.length > charLimit.subject.title ||
      (hasSecretAnswer && stringIsEmpty(secretAnswer) && !secretAttachment)
    ) {
      return;
    }
    onSetSubmittingSubject(true);
    if (
      attachment?.contentType === 'file' ||
      (hasSecretAnswer && secretAttachment)
    ) {
      handleSetTitle('');
      handleSetDescription('');
      handleSetSecretAnswer('');
      handleSetDescriptionFieldShown(false);
      handleSetHasSecretAnswer(false);
      return handleFileUpload({
        attachment,
        description,
        hasSecretAnswer,
        rewardLevel,
        secretAnswer,
        secretAttachment,
        title
      });
    }
    handleUploadSubject();
  }

  function handleSetTitle(text) {
    setTitle(text);
    titleRef.current = text;
  }

  function handleSetDescription(text) {
    setDescription(text);
    descriptionRef.current = text;
  }

  function handleSetDescriptionFieldShown(shown) {
    setDescriptionFieldShown(shown);
    descriptionFieldShownRef.current = shown;
  }

  function handleSetHasSecretAnswer(has) {
    setHasSecretAnswer(has);
    hasSecretAnswerRef.current = has;
  }

  function handleSetSecretAnswer(text) {
    setSecretAnswer(text);
    secretAnswerRef.current = text;
  }

  async function handleUploadSubject() {
    try {
      const data = await uploadContent({
        rootId: attachment?.id,
        rootType: attachment?.contentType,
        title,
        description: finalizeEmoji(description),
        secretAnswer: hasSecretAnswer ? secretAnswer : '',
        rewardLevel
      });
      if (data) {
        onLoadNewFeeds([data]);
        handleSetTitle('');
        handleSetDescription('');
        handleSetSecretAnswer('');
        handleSetDescriptionFieldShown(false);
        handleSetHasSecretAnswer(false);
        onResetSubjectInput();
      }
      onSetSubmittingSubject(false);
      return Promise.resolve();
    } catch (error) {
      console.error(error);
      onSetSubmittingSubject(false);
    }
  }
}

export default memo(SubjectInput);
