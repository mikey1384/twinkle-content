import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { scrollElementToCenter } from 'helpers';
import { useInteractiveContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import Content from './Content';
import Editor from './Editor';
import DropdownButton from 'components/Buttons/DropdownButton';

Slide.propTypes = {
  autoFocus: PropTypes.bool,
  attachment: PropTypes.object,
  contentId: PropTypes.number,
  isEditing: PropTypes.bool,
  style: PropTypes.object,
  heading: PropTypes.string,
  description: PropTypes.string,
  onExpandPath: PropTypes.func,
  options: PropTypes.array,
  slideId: PropTypes.number,
  paths: PropTypes.object,
  selectedOptionId: PropTypes.number
};

export default function Slide({
  autoFocus,
  contentId,
  style,
  heading,
  description,
  isEditing,
  onExpandPath,
  options,
  slideId,
  paths,
  attachment,
  selectedOptionId
}) {
  const {
    actions: { onSetInteractiveState }
  } = useInteractiveContext();
  const SlideRef = useRef(null);
  const { canEdit } = useMyState();
  useEffect(() => {
    if (autoFocus) {
      scrollElementToCenter(SlideRef.current);
    }
  }, [autoFocus]);

  return (
    <div
      ref={SlideRef}
      className={css`
        width: 60%;
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        @media (max-width: ${mobileMaxWidth}) {
          width: 100%;
        }
      `}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '5rem',
        ...style
      }}
    >
      {canEdit && !isEditing && (
        <div className="dropdown-wrapper">
          <DropdownButton
            skeuomorphic
            color="darkerGray"
            direction="left"
            style={{ position: 'absolute', right: '1rem', top: '1rem' }}
            opacity={0.8}
            menuProps={[
              {
                label: 'Edit',
                onClick: () =>
                  onSetInteractiveState({
                    interactiveId: contentId,
                    slideId,
                    newState: { isEditing: true }
                  })
              },
              {
                label: 'Remove',
                onClick: () => console.log('delete')
              }
            ]}
          />
        </div>
      )}
      {isEditing ? (
        <Editor />
      ) : (
        <Content
          attachment={attachment}
          heading={heading}
          description={description}
          options={options}
          onOptionClick={handleOptionClick}
          selectedOptionId={selectedOptionId}
        />
      )}
    </div>
  );

  function handleOptionClick(optionId) {
    if (onExpandPath) {
      onExpandPath({ newSlides: paths[optionId], slideId, optionId });
    }
  }
}
