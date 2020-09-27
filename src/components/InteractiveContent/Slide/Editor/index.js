import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  useAppContext,
  useInputContext,
  useInteractiveContext
} from 'contexts';
import { exceedsCharLimit, finalizeEmoji } from 'helpers/stringHelpers';
import { edit } from 'constants/placeholders';
import DropdownButton from 'components/Buttons/DropdownButton';
import Textarea from 'components/Texts/Textarea';
import Input from 'components/Texts/Input';
import AttachmentField from './AttachmentField';
import FileUploadStatusIndicator from 'components/FileUploadStatusIndicator';
import Button from 'components/Button';
import Icon from 'components/Icon';
import OptionsField from './OptionsField';
import { v1 as uuidv1 } from 'uuid';

Editor.propTypes = {
  attachment: PropTypes.object,
  heading: PropTypes.string,
  description: PropTypes.string,
  fileUploadComplete: PropTypes.bool,
  fileUploadProgress: PropTypes.number,
  isFork: PropTypes.bool,
  optionIds: PropTypes.array,
  optionsObj: PropTypes.object,
  onThumbnailUpload: PropTypes.func,
  interactiveId: PropTypes.number,
  slideId: PropTypes.number
};

export default function Editor({
  attachment,
  description,
  fileUploadComplete,
  fileUploadProgress,
  heading,
  interactiveId,
  isFork,
  onThumbnailUpload,
  optionIds,
  optionsObj,
  slideId
}) {
  const defaultInputState = {
    editedIsFork: isFork,
    editedAttachment: attachment || null,
    editedHeading: heading || '',
    editedDescription: description || '',
    editedOptionIds: optionIds || [],
    editedOptionsObj: optionsObj || {}
  };

  const {
    requestHelpers: { editInteractiveSlide, uploadFile }
  } = useAppContext();
  const {
    state,
    actions: { onSetEditInteractiveForm }
  } = useInputContext();
  const {
    actions: { onSetInteractiveState }
  } = useInteractiveContext();
  const prevInputState = useMemo(
    () => state[`edit-interactive-${interactiveId}-${slideId}`],
    [interactiveId, slideId, state]
  );

  const filePathRef = useRef(null);
  const inputStateRef = useRef(prevInputState || defaultInputState);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [inputState, setInputState] = useState(
    prevInputState || defaultInputState
  );
  const editForm = inputState || {};
  const {
    editedIsFork,
    editedAttachment,
    editedHeading,
    editedDescription,
    editedOptionIds,
    editedOptionsObj
  } = editForm;

  const descriptionExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'interactive',
        inputType: 'description',
        text: editedDescription
      }),
    [editedDescription]
  );

  const headingExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'interactive',
        inputType: 'heading',
        text: editedHeading
      }),
    [editedHeading]
  );

  const doneButtonDisabled = useMemo(() => {
    if (descriptionExceedsCharLimit) {
      return true;
    }
    if (headingExceedsCharLimit) {
      return true;
    }
    return false;
  }, [descriptionExceedsCharLimit, headingExceedsCharLimit]);

  useEffect(() => {
    return function saveInputStateBeforeUnmount() {
      onSetEditInteractiveForm({
        interactiveId,
        slideId,
        form: inputStateRef.current
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideId]);

  return (
    <div
      style={{
        width: '100%'
      }}
    >
      <div
        style={{
          display: 'flex',
          height: '100%',
          alignItems: 'center',
          flexDirection: 'column'
        }}
      >
        <div style={{ width: '70%' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '2rem'
            }}
          >
            <p
              style={{
                fontWeight: 'bold',
                fontSize: '1.7rem',
                marginRight: '1rem'
              }}
            >
              Slide Type:
            </p>
            <DropdownButton
              skeuomorphic
              color="darkerGray"
              direction="right"
              icon="caret-down"
              text={editedIsFork ? 'fork' : 'default'}
              menuProps={[
                {
                  label: editedIsFork ? (
                    'Default'
                  ) : (
                    <>
                      <Icon icon="code-branch" />
                      <span style={{ marginLeft: '0.7rem' }}>Fork</span>
                    </>
                  ),
                  onClick: () =>
                    handleSetInputState({
                      ...editForm,
                      editedIsFork: !editedIsFork
                    })
                }
              ]}
            />
          </div>
          <Input
            onChange={(text) =>
              handleSetInputState({
                ...editForm,
                editedHeading: text
              })
            }
            placeholder={edit.heading}
            value={editedHeading}
            style={headingExceedsCharLimit?.style}
          />
          <Textarea
            minRows={4}
            onChange={(event) => {
              const { value } = event.target;
              handleSetInputState({
                ...editForm,
                editedDescription: value
              });
            }}
            placeholder={edit.description}
            value={editedDescription}
            style={{ marginTop: '1rem', ...descriptionExceedsCharLimit?.style }}
          />
          <AttachmentField
            type={editedAttachment?.type || 'none'}
            isChanging={editedAttachment?.isChanging}
            isYouTubeVideo={editedAttachment?.isYouTubeVideo}
            fileUrl={editedAttachment?.fileUrl || ''}
            linkUrl={editedAttachment?.linkUrl || ''}
            thumbUrl={editedAttachment?.thumbUrl || ''}
            slideId={slideId}
            newAttachment={editedAttachment?.newAttachment || null}
            onSetAttachmentState={(newState) => {
              handleSetInputState({
                ...editForm,
                editedAttachment: {
                  ...editForm.editedAttachment,
                  ...newState
                }
              });
            }}
            onThumbnailUpload={onThumbnailUpload}
            uploadingFile={uploadingFile}
          />
          {editedIsFork && (
            <OptionsField
              style={{ marginTop: '2rem' }}
              editedOptionIds={editedOptionIds}
              editedOptionsObj={editedOptionsObj}
              onSetInputState={(newState) =>
                handleSetInputState({
                  ...editForm,
                  ...newState
                })
              }
            />
          )}
          {uploadingFile && (
            <FileUploadStatusIndicator
              style={{
                fontSize: '1.7rem',
                fontWeight: 'bold',
                marginTop: 0,
                paddingBottom: '1rem'
              }}
              fileName={editedAttachment.newAttachment.file?.name}
              onFileUpload={handleFileUpload}
              uploadComplete={fileUploadComplete}
              uploadProgress={fileUploadProgress}
            />
          )}
        </div>
        <div
          style={{
            marginTop: '2rem',
            width: '100%',
            display: 'flex',
            flexDirection: 'row-reverse'
          }}
        >
          <Button
            color="blue"
            onClick={handleSubmit}
            disabled={doneButtonDisabled}
          >
            Done
          </Button>
          <Button
            transparent
            style={{ marginRight: '1rem' }}
            onClick={() => {
              handleSetInputState(prevInputState);
              onSetInteractiveState({
                interactiveId,
                slideId,
                newState: { isEditing: false }
              });
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  function handleFileUpload() {
    filePathRef.current = uuidv1();
    handleSubmitWithAttachment();
    filePathRef.current = null;

    async function handleSubmitWithAttachment() {
      const uploadedFilePath = await uploadFile({
        context: 'interactive',
        filePath: filePathRef.current,
        file: editedAttachment.newAttachment.file,
        onUploadProgress: handleUploadProgress
      });
      onSetInteractiveState({
        interactiveId,
        slideId,
        newState: { fileUploadComplete: true }
      });
      const post = {
        ...editForm,
        editedAttachment: {
          type: editForm.editedAttachment.type,
          fileUrl: uploadedFilePath
        },
        editedHeading: finalizeEmoji(editedHeading),
        editedDescription: finalizeEmoji(editedDescription)
      };
      const newState = await editInteractiveSlide({
        slideId,
        post
      });
      newState.isEditing = false;
      onSetInteractiveState({
        interactiveId,
        slideId,
        newState: {
          ...newState,
          fileUploadComplete: false,
          fileUploadProgress: null
        }
      });
      onSetEditInteractiveForm({
        interactiveId,
        slideId,
        form: null
      });
    }

    function handleUploadProgress({ loaded, total }) {
      onSetInteractiveState({
        interactiveId,
        slideId,
        newState: { fileUploadProgress: loaded / total }
      });
    }
  }

  function handleSetInputState(newState) {
    setInputState(newState);
    inputStateRef.current = newState;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const post = {
      ...editForm,
      editedHeading: finalizeEmoji(editedHeading),
      editedDescription: finalizeEmoji(editedDescription)
    };
    if (editedAttachment?.newAttachment) {
      return setUploadingFile(true);
    }
    const newState = await editInteractiveSlide({
      slideId,
      post
    });
    newState.isEditing = false;
    onSetInteractiveState({
      interactiveId,
      slideId,
      newState: {
        ...newState,
        fileUploadComplete: false,
        fileUploadProgress: null
      }
    });
    onSetEditInteractiveForm({
      interactiveId,
      slideId,
      form: null
    });
  }
}
