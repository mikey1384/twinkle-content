import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useInputContext, useInteractiveContext } from 'contexts';
import { exceedsCharLimit, finalizeEmoji } from 'helpers/stringHelpers';
import { edit } from 'constants/placeholders';
import Textarea from 'components/Texts/Textarea';
import AttachmentField from './AttachmentField';
import Icon from 'components/Icon';
import Button from 'components/Button';

Editor.propTypes = {
  attachment: PropTypes.object,
  heading: PropTypes.string,
  description: PropTypes.string,
  options: PropTypes.array,
  interactiveId: PropTypes.number,
  slideId: PropTypes.number
};

export default function Editor({
  attachment,
  description,
  heading,
  interactiveId,
  options,
  slideId
}) {
  const defaultInputState = {
    editedAttachment: attachment || '',
    editedHeading: heading || '',
    editedDescription: description || '',
    editedOptions: options || []
  };

  const {
    state,
    actions: { onSetEditInteractiveForm }
  } = useInputContext();
  const {
    actions: { onSetInteractiveState }
  } = useInteractiveContext();
  const prevInputState = useMemo(
    () => state['edit' + `interactive-${interactiveId}-${slideId}`],
    [interactiveId, slideId, state]
  );
  const inputStateRef = useRef(prevInputState || defaultInputState);
  const [inputState, setInputState] = useState(
    prevInputState || defaultInputState
  );
  const editForm = inputState || {};
  const {
    editedAttachment,
    editedHeading,
    editedDescription,
    editedOptions
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
    <div>
      <form onSubmit={handleSubmit}>
        {heading && (
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{heading}</p>
        )}
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
          style={descriptionExceedsCharLimit?.style}
        />
        {attachment && (
          <AttachmentField
            type={editedAttachment.type}
            src={editedAttachment.src}
            onEditedUrlChange={(text) =>
              handleSetInputState({
                ...editForm,
                attachment: {
                  ...editForm.attachment,
                  src: text
                }
              })
            }
          />
        )}
        <div
          style={{
            marginTop: '5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {editedOptions.map((option, index) => (
            <div
              key={option.id}
              style={{ marginTop: index === 0 ? 0 : '1rem' }}
            >
              {option.icon && <Icon icon={option.icon} />}
              <span style={{ marginLeft: '0.7rem' }}>{option.label}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            flexDirection: 'row-reverse'
          }}
        >
          <Button color="blue" type="submit" disabled={doneButtonDisabled}>
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
      </form>
    </div>
  );

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
