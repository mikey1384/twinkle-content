import React from 'react';
import PropTypes from 'prop-types';
import Attachment from '../../Attachment';
import { css } from 'emotion';
import { borderRadius, Color } from 'constants/css';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useAppContext, useInteractiveContext } from 'contexts';

ArchivedSlideItem.propTypes = {
  interactiveId: PropTypes.number.isRequired,
  slide: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function ArchivedSlideItem({ interactiveId, slide, style }) {
  const {
    requestHelpers: { updateEmbedData }
  } = useAppContext();
  const {
    actions: { onSetInteractiveState }
  } = useInteractiveContext();

  return (
    <div
      style={style}
      className={css`
        width: 100%;
        cursor: pointer;
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        background: #fff;
        .label {
          color: ${Color.black()};
          transition: color 1s;
        }
        transition: background 0.5s, border 0.5s;
        &:hover {
          border-color: ${Color.darkerBorderGray()};
          .label {
            color: ${Color.black()};
          }
          background: ${Color.highlightGray()};
        }
      `}
    >
      <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{slide.heading}</p>
      <div
        style={{
          width: '100%',
          fontSize: stringIsEmpty(slide.heading) ? '1.5rem' : '1.3rem',
          marginTop: stringIsEmpty(slide.heading) ? 0 : '0.5rem'
        }}
      >
        {slide.description}
      </div>
      {slide.attachment && (
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Attachment
            small
            type={slide.attachment.type}
            isYouTubeVideo={slide.attachment.isYouTubeVideo}
            fileUrl={slide.attachment.fileUrl}
            linkUrl={slide.attachment.linkUrl}
            thumbUrl={slide.attachment.thumbUrl}
            actualTitle={slide.attachment.actualTitle}
            actualDescription={slide.attachment.actualDescription}
            prevUrl={slide.attachment.prevUrl}
            siteUrl={slide.attachment.siteUrl}
            slideId={slide.id}
            onEmbedDataLoad={handleEmbedDataLoad}
            onSetEmbedProps={handleSetEmbedProps}
            onThumbnailUpload={handleThumbnailUpload}
          />
        </div>
      )}
    </div>
  );

  async function handleEmbedDataLoad({
    thumbUrl,
    actualTitle,
    actualDescription,
    siteUrl
  }) {
    updateEmbedData({
      slideId: slide.id,
      thumbUrl,
      actualTitle,
      actualDescription,
      siteUrl
    });
  }

  async function handleSetEmbedProps(params) {
    onSetInteractiveState({
      interactiveId,
      slideId: slide.id,
      newState: {
        attachment: {
          ...slide.attachment,
          ...params
        }
      }
    });
  }

  function handleThumbnailUpload(thumbUrl) {
    onSetInteractiveState({
      interactiveId,
      slideId: slide.id,
      newState: {
        attachment: {
          ...slide.attachment,
          thumbUrl
        }
      }
    });
  }
}
