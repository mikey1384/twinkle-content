import React from 'react';
import PropTypes from 'prop-types';
import Attachment from './Attachment';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { Color } from 'constants/css';

Content.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  attachment: PropTypes.object,
  options: PropTypes.array,
  onOptionClick: PropTypes.func,
  selectedOptionId: PropTypes.number
};
export default function Content({
  heading,
  description,
  attachment,
  options,
  onOptionClick,
  selectedOptionId
}) {
  return (
    <>
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
              onClick={() => onOptionClick(option.id)}
            >
              {option.icon && <Icon icon={option.icon} />}
              <span style={{ marginLeft: '0.7rem' }}>{option.label}</span>
              {selectedOptionId === option.id ? (
                <Icon
                  icon="check"
                  style={{ marginLeft: '0.7rem', color: Color.green() }}
                />
              ) : null}
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
