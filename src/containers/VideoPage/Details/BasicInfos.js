import React from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import FullTextReveal from 'components/Texts/FullTextReveal';
import UsernameText from 'components/Texts/UsernameText';
import { edit } from 'constants/placeholders';
import { timeSince } from 'helpers/timeStampHelpers';
import { mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { addEmoji } from 'helpers/stringHelpers';

BasicInfos.propTypes = {
  className: PropTypes.string,
  editedUrl: PropTypes.string,
  editedTitle: PropTypes.string,
  innerRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onSetEditForm: PropTypes.func.isRequired,
  onEdit: PropTypes.bool.isRequired,
  titleHovered: PropTypes.bool.isRequired,
  onTitleClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  title: PropTypes.string.isRequired,
  titleExceedsCharLimit: PropTypes.func.isRequired,
  timeStamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  videoId: PropTypes.number.isRequired,
  uploader: PropTypes.object.isRequired,
  urlExceedsCharLimit: PropTypes.func.isRequired
};

export default function BasicInfos({
  className,
  editedUrl,
  editedTitle,
  innerRef,
  onSetEditForm,
  onEdit,
  onMouseLeave,
  onMouseOver,
  onTitleClick,
  style,
  title,
  titleHovered,
  timeStamp,
  titleExceedsCharLimit,
  uploader,
  urlExceedsCharLimit,
  videoId
}) {
  return (
    <div className={className} style={style}>
      {onEdit ? (
        <div>
          <Input
            placeholder={edit.video}
            value={editedUrl}
            onChange={(text) =>
              onSetEditForm({
                contentId: videoId,
                contentType: 'video',
                form: {
                  editedUrl: text
                }
              })
            }
            style={urlExceedsCharLimit(editedUrl)?.style}
          />
          <Input
            placeholder={edit.title}
            value={editedTitle}
            onChange={(text) =>
              onSetEditForm({
                contentId: videoId,
                contentType: 'video',
                form: {
                  editedTitle: text
                }
              })
            }
            onKeyUp={(event) => {
              if (event.key === ' ') {
                onSetEditForm({
                  contentId: videoId,
                  contentType: 'video',
                  form: {
                    editedTitle: addEmoji(event.target.value)
                  }
                });
              }
            }}
            style={{
              marginTop: '1rem',
              ...(titleExceedsCharLimit(editedTitle)?.style || {})
            }}
          />
          {titleExceedsCharLimit(editedTitle) && (
            <small style={{ color: 'red' }}>
              {titleExceedsCharLimit(editedTitle)?.message}
            </small>
          )}
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <div
            ref={innerRef}
            style={{
              width: '100%',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              lineHeight: 'normal'
            }}
          >
            <span
              className={css`
                font-size: 2.5rem;
                @media (max-width: ${mobileMaxWidth}) {
                  font-size: 2rem;
                }
              `}
              style={{
                fontWeight: 'bold',
                cursor: 'default'
              }}
              onClick={onTitleClick}
              onMouseOver={onMouseOver}
              onMouseLeave={onMouseLeave}
            >
              {title}
            </span>
          </div>
          <FullTextReveal show={titleHovered} text={title} />
        </div>
      )}
      {!onEdit && (
        <div>
          Added by <UsernameText user={uploader} />{' '}
          <span>{`${timeStamp ? timeSince(timeStamp) : ''}`}</span>
        </div>
      )}
    </div>
  );
}
