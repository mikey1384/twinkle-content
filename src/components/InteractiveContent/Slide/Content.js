import React from 'react';
import PropTypes from 'prop-types';
import Attachment from '../Attachment';
import Button from 'components/Button';
import Icon from 'components/Icon';
import LongText from 'components/Texts/LongText';
import { Color } from 'constants/css';

Content.propTypes = {
  heading: PropTypes.string,
  isPublished: PropTypes.bool,
  description: PropTypes.string,
  attachment: PropTypes.object,
  optionIds: PropTypes.array,
  optionsObj: PropTypes.object,
  onOptionClick: PropTypes.func,
  onEmbedDataLoad: PropTypes.func,
  onSetEmbedProps: PropTypes.func,
  onThumbnailUpload: PropTypes.func,
  slideId: PropTypes.number,
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
  onEmbedDataLoad,
  onSetEmbedProps,
  onThumbnailUpload,
  slideId,
  selectedOptionId
}) {
  return (
    <div style={{ width: '100%' }}>
      {!isPublished && (
        <div
          style={{
            textAlign: 'center',
            padding: '0 1rem 1rem 1rem',
            color: Color.rose(),
            fontWeight: 'bold',
            fontSize: '1.3rem'
          }}
        >{`(Draft)`}</div>
      )}
      {heading && (
        <p
          style={{
            textAlign: 'center',
            fontSize: '3rem',
            fontWeight: 'bold',
            marginTop: '1.5rem'
          }}
        >
          {heading}
        </p>
      )}
      {description && (
        <div style={{ fontSize: '2rem', marginTop: '1.5rem' }}>
          <LongText maxLines={100}>{description}</LongText>
        </div>
      )}
      {attachment && (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Attachment
            type={attachment.type}
            isYouTubeVideo={attachment.isYouTubeVideo}
            fileUrl={attachment.fileUrl}
            linkUrl={attachment.linkUrl}
            thumbUrl={attachment.thumbUrl}
            actualTitle={attachment.actualTitle}
            actualDescription={attachment.actualDescription}
            prevUrl={attachment.prevUrl}
            siteUrl={attachment.siteUrl}
            slideId={slideId}
            onEmbedDataLoad={onEmbedDataLoad}
            onSetEmbedProps={onSetEmbedProps}
            onThumbnailUpload={onThumbnailUpload}
          />
        </div>
      )}
      {optionIds?.length > 0 && (
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
    </div>
  );
}
