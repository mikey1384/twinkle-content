import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useAppContext, useInteractiveContext } from 'contexts';
import { scrollElementToCenter } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import Content from './Content';
import Deleted from './Deleted';
import Editor from './Editor';
import Button from 'components/Button';
import Icon from 'components/Icon';
import InsertSlide from './InsertSlide';
import DropdownButton from 'components/Buttons/DropdownButton';

Slide.propTypes = {
  autoFocus: PropTypes.bool,
  attachment: PropTypes.object,
  fileUploadComplete: PropTypes.bool,
  fileUploadProgress: PropTypes.number,
  insertButtonShown: PropTypes.bool,
  interactiveId: PropTypes.number,
  style: PropTypes.object,
  heading: PropTypes.string,
  isDeleted: PropTypes.bool,
  isEditing: PropTypes.bool,
  isPublished: PropTypes.bool,
  isFork: PropTypes.bool,
  forkedFrom: PropTypes.number,
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
  fileUploadComplete,
  fileUploadProgress,
  insertButtonShown,
  interactiveId,
  isDeleted,
  isPublished,
  isEditing,
  isFork,
  forkedFrom,
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
    requestHelpers: {
      deleteInteractiveSlide,
      publishInteractiveSlide,
      undeleteInteractiveSlide,
      unPublishInteractiveSlide,
      updateEmbedData
    }
  } = useAppContext();
  const {
    actions: { onRemoveInteractiveSlide, onSetInteractiveState }
  } = useInteractiveContext();
  const SlideRef = useRef(null);
  const { canEdit } = useMyState();
  useEffect(() => {
    if (autoFocus) {
      scrollElementToCenter(SlideRef.current);
    }
  }, [autoFocus]);

  const paddingShown = useMemo(() => {
    return !stringIsEmpty(heading) && !isEditing;
  }, [heading, isEditing]);

  const dropdownMenuProps = useMemo(() => {
    return [
      {
        label: (
          <>
            <Icon icon="pencil-alt" />
            <span style={{ marginLeft: '1rem' }}>Edit</span>
          </>
        ),
        onClick: () =>
          onSetInteractiveState({
            interactiveId,
            slideId,
            newState: { isEditing: true }
          })
      },
      ...(!isPublished
        ? [
            {
              label: (
                <>
                  <Icon icon="upload" />
                  <span style={{ marginLeft: '1rem' }}>Publish</span>
                </>
              ),
              onClick: handlePublishSlide
            }
          ]
        : []),
      {
        label: isPublished ? (
          <>
            <Icon icon="ban" />
            <span style={{ marginLeft: '1rem' }}>Unpublish</span>
          </>
        ) : (
          <>
            <Icon icon="trash-alt" />
            <span style={{ marginLeft: '1rem' }}>Delete</span>
          </>
        ),
        onClick: isPublished ? handleUnpublishSlide : handleDeleteSlide
      }
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactiveId, isPublished, isDeleted, slideId]);

  return (
    <>
      {insertButtonShown && (
        <InsertSlide
          forkedFrom={forkedFrom}
          interactiveId={interactiveId}
          slideId={slideId}
          style={{ marginTop: '2rem' }}
        />
      )}
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
          paddingLeft: '2rem',
          paddingRight: '2rem',
          paddingTop: isEditing ? '2rem' : '1rem',
          ...style
        }}
      >
        {canEdit && !isEditing && !isDeleted && (
          <div className="dropdown-wrapper">
            <DropdownButton
              skeuomorphic
              color="darkerGray"
              direction="left"
              style={{
                position: 'absolute',
                right: '1rem',
                top: '1rem',
                zIndex: 10
              }}
              opacity={0.8}
              menuProps={dropdownMenuProps}
            />
          </div>
        )}
        {isEditing ? (
          <Editor
            attachment={attachment}
            description={description}
            fileUploadComplete={fileUploadComplete}
            fileUploadProgress={fileUploadProgress}
            heading={heading}
            interactiveId={interactiveId}
            isFork={isFork}
            optionIds={optionIds}
            optionsObj={optionsObj}
            slideId={slideId}
            onThumbnailUpload={handleThumbnailUpload}
          />
        ) : isDeleted ? (
          <Deleted
            onRemoveInteractiveSlide={() =>
              onRemoveInteractiveSlide({ interactiveId, slideId })
            }
            onUndeleteSlide={handleUndeleteSlide}
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
            onEmbedDataLoad={handleEmbedDataLoad}
            onSetEmbedProps={handleSetEmbedProps}
            onThumbnailUpload={handleThumbnailUpload}
            slideId={slideId}
            selectedOptionId={selectedOptionId}
          />
        )}
        <div
          style={{
            paddingBottom: isDeleted ? '1rem' : paddingShown ? '4rem' : '2rem'
          }}
        />
        {!isPublished && !isEditing && !isDeleted && (
          <div>
            <Button
              onClick={handlePublishSlide}
              style={{ marginBottom: '1.5rem' }}
              skeuomorphic
            >
              <Icon icon="upload" />
              <span style={{ marginLeft: '0.7rem' }}>Publish Slide</span>
            </Button>
          </div>
        )}
      </div>
    </>
  );

  async function handleDeleteSlide() {
    await deleteInteractiveSlide(slideId);
    onSetInteractiveState({
      interactiveId,
      slideId,
      newState: { isDeleted: true }
    });
  }

  function handleOptionClick(optionId) {
    if (onExpandPath) {
      onExpandPath({ newSlides: paths[optionId], slideId, optionId });
    }
  }

  async function handlePublishSlide() {
    await publishInteractiveSlide(slideId);
    onSetInteractiveState({
      interactiveId,
      slideId,
      newState: { isPublished: true }
    });
  }

  async function handleUnpublishSlide() {
    await unPublishInteractiveSlide(slideId);
    onSetInteractiveState({
      interactiveId,
      slideId,
      newState: { isPublished: false }
    });
  }

  async function handleEmbedDataLoad({
    thumbUrl,
    actualTitle,
    actualDescription,
    siteUrl
  }) {
    updateEmbedData({
      slideId,
      thumbUrl,
      actualTitle,
      actualDescription,
      siteUrl
    });
  }

  async function handleSetEmbedProps(params) {
    onSetInteractiveState({
      interactiveId,
      slideId,
      newState: {
        attachment: {
          ...attachment,
          ...params
        }
      }
    });
  }

  function handleThumbnailUpload(thumbUrl) {
    onSetInteractiveState({
      interactiveId,
      slideId,
      newState: {
        attachment: {
          ...attachment,
          thumbUrl
        }
      }
    });
  }

  async function handleUndeleteSlide() {
    await undeleteInteractiveSlide(slideId);
    onSetInteractiveState({
      interactiveId,
      slideId,
      newState: { isDeleted: false }
    });
  }
}
