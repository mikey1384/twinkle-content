import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useInputContext, useInteractiveContext } from 'contexts';
import { exceedsCharLimit, finalizeEmoji } from 'helpers/stringHelpers';
import { edit } from 'constants/placeholders';
import DropdownButton from 'components/Buttons/DropdownButton';
import Textarea from 'components/Texts/Textarea';
import Input from 'components/Texts/Input';
import AttachmentField from './AttachmentField';
import Button from 'components/Button';
import OptionsField from './OptionsField';

Editor.propTypes = {
  attachment: PropTypes.object,
  heading: PropTypes.string,
  description: PropTypes.string,
  isFork: PropTypes.bool,
  optionIds: PropTypes.array,
  optionsObj: PropTypes.object,
  interactiveId: PropTypes.number,
  slideId: PropTypes.number
};

export default function Editor({
  attachment,
  description,
  heading,
  interactiveId,
  isFork,
  optionIds,
  optionsObj,
  slideId
}) {
  const defaultInputState = {
    editedIsFork: isFork,
    editedAttachment: attachment || '',
    editedHeading: heading || '',
    editedDescription: description || '',
    editedOptionIds: optionIds || [],
    editedOptionsObj: optionsObj || {}
  };
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

  const inputStateRef = useRef(prevInputState || defaultInputState);
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
                  label: editedIsFork ? 'Default' : 'Fork',
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
          {attachment && (
            <AttachmentField
              type={editedAttachment.type}
              src={editedAttachment.src}
              onAttachmentTypeChange={handleAttachmentTypeChange}
              onEditedUrlChange={(text) => {
                handleSetInputState({
                  ...editForm,
                  editedAttachment: {
                    ...editForm.editedAttachment,
                    src: text
                  }
                });
              }}
            />
          )}
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
            onClick={() =>
              onSetInteractiveState({
                interactiveId,
                slideId,
                newState: { isEditing: false }
              })
            }
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  function handleAttachmentTypeChange() {
    const newType = editedAttachment.type === 'link' ? 'file' : 'link';
    handleSetInputState({
      ...editForm,
      editedAttachment: {
        ...editForm.editedAttachment,
        type: newType
      }
    });
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
    console.log(post);
    onSetInteractiveState({
      interactiveId,
      slideId,
      newState: { isEditing: false }
    });
  }
}
