import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { scrollElementToCenter } from 'helpers';
import { useAppContext, useInteractiveContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import Content from './Content';
import Editor from './Editor';
import DropdownButton from 'components/Buttons/DropdownButton';

Slide.propTypes = {
  autoFocus: PropTypes.bool,
  attachment: PropTypes.object,
  interactiveId: PropTypes.number,
  style: PropTypes.object,
  heading: PropTypes.string,
  isEditing: PropTypes.bool,
  isPublished: PropTypes.bool,
  isFork: PropTypes.bool,
  description: PropTypes.string,
  onExpandPath: PropTypes.func,
  optionIds: PropTypes.array,
  optionsObj: PropTypes.object,
  slideId: PropTypes.number,
  paths: PropTypes.object,
  selectedOptionId: PropTypes.number
};

export default function Slide({
  autoFocus,
  heading,
  description,
  interactiveId,
  isPublished,
  isEditing,
  isFork,
  onExpandPath,
  optionIds,
  optionsObj,
  slideId,
  paths,
  attachment,
  selectedOptionId,
  style
}) {
  const {
    requestHelpers: { deleteInteractiveSlide }
  } = useAppContext();
  const {
    actions: { onDeleteInteractiveSlide, onSetInteractiveState }
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
        background: #fff;
        width: 60%;
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
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingTop: isEditing ? '2rem' : '1rem',
        paddingBottom: isEditing ? '1rem' : '5rem',
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
                    interactiveId,
                    slideId,
                    newState: { isEditing: true }
                  })
              },
              {
                label: 'Remove',
                onClick: handleDeleteSlide
              }
            ]}
          />
        </div>
      )}
      {isEditing ? (
        <Editor
          attachment={attachment}
          description={description}
          heading={heading}
          interactiveId={interactiveId}
          isFork={isFork}
          optionIds={optionIds}
          optionsObj={optionsObj}
          slideId={slideId}
        />
      ) : (
        <Content
          isPublished={isPublished}
          attachment={attachment}
          heading={heading}
          description={description}
          optionIds={optionIds}
          optionsObj={optionsObj}
          onOptionClick={handleOptionClick}
          selectedOptionId={selectedOptionId}
        />
      )}
    </div>
  );

  async function handleDeleteSlide() {
    await deleteInteractiveSlide(slideId);
    onDeleteInteractiveSlide({ interactiveId, slideId });
  }

  function handleOptionClick(optionId) {
    if (onExpandPath) {
      onExpandPath({ newSlides: paths[optionId], slideId, optionId });
    }
  }
}
