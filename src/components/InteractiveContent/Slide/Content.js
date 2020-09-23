import React from 'react';
import PropTypes from 'prop-types';
import Attachment from './Attachment';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { Color } from 'constants/css';

Content.propTypes = {
  heading: PropTypes.string,
  isPublished: PropTypes.bool,
  description: PropTypes.string,
  attachment: PropTypes.object,
  optionIds: PropTypes.array,
  optionsObj: PropTypes.object,
  onOptionClick: PropTypes.func,
  selectedOptionId: PropTypes.number
};
export default function Content({
  heading,
  isPublished,
  description,
  attachment,
  optionIds,
  optionsObj,
  onOptionClick,
  selectedOptionId
}) {
  return (
    <>
      {!isPublished && (
        <div
          style={{
            padding: '0 1rem 1rem 1rem',
            color: Color.rose(),
            fontWeight: 'bold',
            fontSize: '1.3rem'
          }}
        >{`(Draft)`}</div>
      )}
      {heading && (
        <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{heading}</p>
      )}
      {description && (
        <p style={{ fontSize: '2rem', marginTop: '1.5rem' }}>{description}</p>
      )}
      {attachment && (
        <Attachment
          type={attachment.type}
          fileUrl={attachment.fileUrl}
          linkUrl={attachment.linkUrl}
        />
      )}
      {optionIds.length > 0 && (
        <div
          style={{
            marginTop: '5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {optionIds.map((optionId, index) => {
            const option = optionsObj[optionId];
            return (
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
            );
          })}
        </div>
      )}
    </>
  );
}
