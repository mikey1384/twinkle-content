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
import ForkButtonsField from './ForkButtonsField';
import GoBackField from './GoBackField';
import { v1 as uuidv1 } from 'uuid';

Editor.propTypes = {
  attachment: PropTypes.object,
  heading: PropTypes.string,
  description: PropTypes.string,
  fileUploadComplete: PropTypes.bool,
  fileUploadProgress: PropTypes.number,
  forkedFrom: PropTypes.number,
  isFork: PropTypes.bool,
  isPortal: PropTypes.bool,
  forkButtonIds: PropTypes.array,
  forkButtonsObj: PropTypes.object,
  portalButton: PropTypes.object,
  onThumbnailUpload: PropTypes.func,
  paths: PropTypes.object,
  interactiveId: PropTypes.number,
  slideId: PropTypes.number,
  slideObj: PropTypes.object,
  isLastSlide: PropTypes.bool
};

export default function Editor({
  attachment,
  description,
  fileUploadComplete,
  fileUploadProgress,
  forkedFrom,
  heading,
  interactiveId,
  isFork,
  isPortal,
  isLastSlide,
  onThumbnailUpload,
  forkButtonIds,
  forkButtonsObj,
  portalButton,
  paths,
  slideId,
  slideObj
}) {
  const defaultInputState = {
    editedPortalButton: portalButton || {
      label: 'Go Back',
      icon: 'history',
      destination: forkedFrom
    },
    editedIsFork: isFork,
    editedIsPortal: isPortal,
    editedAttachment: attachment || null,
    editedHeading: heading || '',
    editedDescription: description || '',
    editedForkButtonIds: forkButtonIds.length > 0 ? forkButtonIds : [1, 2],
    editedForkButtonsObj:
      forkButtonsObj && Object.keys(forkButtonsObj).length > 0
        ? forkButtonsObj
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

  const mounted = useRef(true);
  const filePathRef = useRef(null);
  const inputStateRef = useRef(prevInputState || defaultInputState);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [inputState, setInputState] = useState(
    prevInputState || defaultInputState
  );
  const editForm = inputState || {};
  const {
    editedPortalButton,
    editedIsFork,
    editedIsPortal,
    editedAttachment,
    editedHeading,
    editedDescription,
    editedForkButtonIds,
    editedForkButtonsObj
  } = editForm;

  const forkSwitchShown = useMemo(() => isLastSlide && !isFork, [
    isFork,
    isLastSlide
  ]);
  const portalSwitchShown = !!forkedFrom;

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
      for (let [, button] of Object.entries(editedForkButtonsObj)) {
        if (
          stringIsEmpty(button.label) ||
          exceedsCharLimit({
            contentType: 'interactive',
            inputType: 'heading',
            text: button.label
          })
        ) {
          return true;
        }
      }
    }
    return false;
  }, [
    descriptionExceedsCharLimit,
    editedIsFork,
    editedForkButtonsObj,
    headingExceedsCharLimit
  ]);

  useEffect(() => {
    mounted.current = true;
    return function saveInputStateBeforeUnmount() {
      onSetEditInteractiveForm({
        interactiveId,
        slideId,
        form: inputStateRef.current
      });
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              {forkSwitchShown && (
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
            {((editedIsFork && forkSwitchShown) || isFork) && (
              <ForkButtonsField
                style={{ marginTop: '1rem' }}
                editedForkButtonIds={editedForkButtonIds}
                editedForkButtonsObj={editedForkButtonsObj}
                onSetInputState={(newState) =>
                  handleSetInputState({
                    ...editForm,
                    ...newState
                  })
                }
              />
            )}
          </div>
          {portalSwitchShown && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                marginTop: '2rem'
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
              {editedIsPortal && (
                <GoBackField
                  button={editedPortalButton}
                  forkedFrom={forkedFrom}
                  interactiveId={interactiveId}
                  onSetButtonState={(newState) =>
                    handleSetInputState({
                      ...editForm,
                      editedPortalButton: {
                        ...editForm.editedPortalButton,
                        ...newState
                      }
                    })
                  }
                  slideObj={slideObj}
                  style={{ marginTop: '1rem' }}
                />
              )}
            </div>
          )}
        </div>
        <div
          style={{
            marginTop: forkSwitchShown || portalSwitchShown ? '2rem' : 0,
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
      if (mounted.current) {
        onSetSlideState({
          interactiveId,
          slideId,
          newState: { fileUploadComplete: true }
        });
      }
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
      if (mounted.current) {
        onChangeNumUpdates({ interactiveId, numUpdates });
      }
      if (mounted.current) {
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
      }
      if (mounted.current) {
        handleSetInputState(post);
      }
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
    if (mounted.current) {
      onChangeNumUpdates({ interactiveId, numUpdates });
    }
    if (mounted.current) {
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
    }
    if (mounted.current) {
      handleSetInputState(post);
    }
  }
}
