import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { panel } from '../../../Styles';
import { scrollElementToCenter } from 'helpers';
import Content from './Content';

Slide.propTypes = {
  autoFocus: PropTypes.bool,
  attachment: PropTypes.object,
  style: PropTypes.object,
  heading: PropTypes.string,
  description: PropTypes.string,
  onExpandPath: PropTypes.func,
  options: PropTypes.array,
  panelId: PropTypes.number,
  paths: PropTypes.object,
  selectedOptionId: PropTypes.number
};

export default function Slide({
  autoFocus,
  style,
  heading,
  description,
  onExpandPath,
  options,
  panelId,
  paths,
  attachment,
  selectedOptionId
}) {
  const SlideRef = useRef(null);
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
      <Content
        attachment={attachment}
        heading={heading}
        description={description}
        options={options}
        onOptionClick={handleOptionClick}
        selectedOptionId={selectedOptionId}
      />
    </div>
  );

  function handleOptionClick(optionId) {
    if (onExpandPath) {
      onExpandPath({ newSlides: paths[optionId], panelId, optionId });
    }
  }
}
