import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { panel } from '../../../Styles';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Attachment from './Attachment';
import { scrollElementToCenter } from 'helpers';

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
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '5rem',
        ...style
      }}
    >
      {heading && (
        <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{heading}</p>
      )}
      {description && (
        <p style={{ fontSize: '2rem', marginTop: '1.5rem' }}>{description}</p>
      )}
      {attachment && <Attachment type={attachment.type} src={attachment.src} />}
      {options && (
        <div
          style={{
            marginTop: '5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {options.map((option, index) => (
            <Button
              key={option.id}
              skeuomorphic
              style={{ marginTop: index === 0 ? 0 : '1rem' }}
              onClick={() => handleOptionClick(option.id)}
            >
              {option.icon && <Icon icon={option.icon} />}
              <span style={{ marginLeft: '0.7rem' }}>{option.label}</span>
              {selectedOptionId === option.id ? (
                <Icon icon="check" style={{ marginLeft: '0.7rem' }} />
              ) : null}
            </Button>
          ))}
        </div>
      )}
    </div>
  );

  function handleOptionClick(optionId) {
    if (onExpandPath) {
      onExpandPath({ newSlides: paths[optionId], panelId, optionId });
    }
  }
}
