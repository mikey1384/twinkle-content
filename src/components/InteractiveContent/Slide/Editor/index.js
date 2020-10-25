import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  useAppContext,
  useInputContext,
  useInteractiveContext
} from 'contexts';
import {
  exceedsCharLimit,
  finalizeEmoji,
  stringIsEmpty
} from 'helpers/stringHelpers';
import { edit } from 'constants/placeholders';
import Textarea from 'components/Texts/Textarea';
import Input from 'components/Texts/Input';
import AttachmentField from './AttachmentField';
import FileUploadStatusIndicator from 'components/FileUploadStatusIndicator';
import SwitchButton from 'components/Buttons/SwitchButton';
import Button from 'components/Button';
import Icon from 'components/Icon';
import OptionsField from './OptionsField';
import GoBackField from './GoBackField';
import { v1 as uuidv1 } from 'uuid';

Editor.propTypes = {
  attachment: PropTypes.object,
  heading: PropTypes.string,
  description: PropTypes.string,
  fileUploadComplete: PropTypes.bool,
  fileUploadProgress: PropTypes.number,
  isFork: PropTypes.bool,
  isPortal: PropTypes.bool,
  optionIds: PropTypes.array,
  optionsObj: PropTypes.object,
  onThumbnailUpload: PropTypes.func,
  paths: PropTypes.object,
  interactiveId: PropTypes.number,
  slideId: PropTypes.number,
  isLastSlide: PropTypes.bool
};

export default function Editor({
  attachment,
  description,
  fileUploadComplete,
  fileUploadProgress,
  heading,
  interactiveId,
  isFork,
  isPortal,
  isLastSlide,
  onThumbnailUpload,
  optionIds,
  optionsObj,
  paths,
  slideId
}) {
  const defaultInputState = {
    editedIsFork: isFork,
    editedIsPortal: isPortal,
    editedAttachment: attachment || null,
    editedHeading: heading || '',
    editedDescription: description || '',
    editedOptionIds: optionIds.length > 0 ? optionIds : [1, 2],
    editedOptionsObj:
      optionsObj && Object.keys(optionsObj).length > 0
        ? optionsObj
        : {
            1: {
              id: 1,
              label: 'path 1'
            },
            2: {
              id: 2,
              label: 'path 2'
            }
          }
  };

  const {
    requestHelpers: { editInteractiveSlide, uploadFile }
  } = useAppContext();
  const {
    state,
    actions: { onSetEditInteractiveForm }
  } = useInputContext();
  const {
    actions: { onChangeNumUpdates, onSetSlideState }
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
    editedIsPortal,
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
    if (editedIsFork) {
      for (let [, option] of Object.entries(editedOptionsObj)) {
        if (stringIsEmpty(option.label)) {
          return true;
        }
      }
    }
    return false;
  }, [
    descriptionExceedsCharLimit,
    editedIsFork,
    editedOptionsObj,
    headingExceedsCharLimit
  ]);

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
          <div style={{ marginTop: '2rem', width: '100%' }}>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {isLastSlide && !isFork && (
                <SwitchButton
                  labelStyle={{
                    fontSize: '1.7rem',
                    fontWeight: 'bold'
                  }}
                  label={
                    <>
                      <Icon icon="code-branch" />
                      <span style={{ marginLeft: '0.7rem' }}>fork buttons</span>
                    </>
                  }
                  checked={editedIsFork}
                  onChange={() =>
                    handleSetInputState({
                      ...editForm,
                      editedIsFork: !editedIsFork
                    })
                  }
                />
              )}
            </div>
            {editedIsFork && (
              <OptionsField
                style={{ marginTop: '1rem' }}
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
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1.5rem'
            }}
          >
            <SwitchButton
              labelStyle={{
                fontSize: '1.7rem',
                fontWeight: 'bold'
              }}
              label={
                <>
                  <Icon icon="history" />
                  <span style={{ marginLeft: '0.7rem' }}>go back button</span>
                </>
              }
              checked={editedIsPortal}
              onChange={() =>
                handleSetInputState({
                  ...editForm,
                  editedIsPortal: !editedIsPortal
                })
              }
            />
            {editedIsPortal && <GoBackField />}
          </div>
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
              onSetSlideState({
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
      onSetSlideState({
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
      const { slide: newState, numUpdates } = await editInteractiveSlide({
        slideId,
        post
      });
      onChangeNumUpdates({ interactiveId, numUpdates });
      newState.isEditing = false;
      onSetSlideState({
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
      onSetSlideState({
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
      editedPaths: paths,
      editedHeading: finalizeEmoji(editedHeading),
      editedDescription: finalizeEmoji(editedDescription)
    };
    if (editedAttachment?.newAttachment) {
      return setUploadingFile(true);
    }
    const { slide: newState, numUpdates } = await editInteractiveSlide({
      slideId,
      post
    });
    onChangeNumUpdates({ interactiveId, numUpdates });
    onSetSlideState({
      interactiveId,
      slideId,
      newState: {
        ...newState,
        isEditing: false,
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
