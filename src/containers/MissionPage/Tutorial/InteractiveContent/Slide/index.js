import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { panel } from '../../../Styles';
import { scrollElementToCenter } from 'helpers';
import { useInteractiveContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import Content from './Content';
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
    actions: { onSetSlideEditStatus }
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
      className={panel}
      style={{
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
            opacity={0.8}
            menuProps={[
              {
                label: 'Edit',
                onClick: () =>
                  onSetSlideEditStatus({
                    contentId,
                    slideId,
                    isEditing: true
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
        <div>is being edited</div>
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
