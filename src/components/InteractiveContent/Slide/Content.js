import React from 'react';
import PropTypes from 'prop-types';
import Attachment from '../Attachment';
import Button from 'components/Button';
import Icon from 'components/Icon';
import LongText from 'components/Texts/LongText';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

Content.propTypes = {
  heading: PropTypes.string,
  interactiveId: PropTypes.number,
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
  interactiveId,
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
    <div style={{ width: '100%', height: '100%' }}>
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
          className={css`
            text-align: center;
            font-size: 3rem;
            font-weight: bold;
            margin-top: 1.5rem;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.7rem;
            }
          `}
        >
          {heading}
        </p>
      )}
      {description && (
        <div
          className={css`
            font-size: 2rem;
            margin-top: 1.5rem;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 1.5rem;
            }
          `}
        >
          <LongText maxLines={100}>{description}</LongText>
        </div>
      )}
      {attachment && (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Attachment
            type={attachment.type}
            interactiveId={interactiveId}
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
          className={css`
            margin-top: 5rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            @media (max-width: ${mobileMaxWidth}) {
              margin-top: 3rem;
            }
          `}
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
                <span style={{ marginLeft: option.icon ? '0.7rem' : 0 }}>
                  {option.label}
                </span>
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
