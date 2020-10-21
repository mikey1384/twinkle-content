import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useAppContext, useInteractiveContext } from 'contexts';
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
  attachment: PropTypes.object,
  cannotMoveUp: PropTypes.bool,
  cannotMoveDown: PropTypes.bool,
  fileUploadComplete: PropTypes.bool,
  fileUploadProgress: PropTypes.number,
  innerRef: PropTypes.func,
  index: PropTypes.number,
  insertButtonShown: PropTypes.bool,
  interactiveId: PropTypes.number,
  style: PropTypes.object,
  heading: PropTypes.string,
  isDeleted: PropTypes.bool,
  isEditing: PropTypes.bool,
  isPublished: PropTypes.bool,
  isLastSlide: PropTypes.bool,
  isFork: PropTypes.bool,
  forkedFrom: PropTypes.number,
  description: PropTypes.string,
  onExpandPath: PropTypes.func,
  onMoveSlide: PropTypes.func,
  optionIds: PropTypes.array,
  optionsObj: PropTypes.object,
  slideId: PropTypes.number,
  paths: PropTypes.object,
  selectedOptionId: PropTypes.number
};

export default function Slide({
  cannotMoveUp,
  cannotMoveDown,
  heading,
  index,
  description,
  fileUploadComplete,
  fileUploadProgress,
  innerRef,
  insertButtonShown,
  interactiveId,
  isDeleted,
  isLastSlide,
  isPublished,
  isEditing,
  isFork,
  forkedFrom,
  onExpandPath,
  onMoveSlide,
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
  const { canEdit } = useMyState();

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
      ...(isFork
        ? []
        : [
            ...(cannotMoveUp
              ? []
              : [
                  {
                    label: (
                      <>
                        <Icon icon="arrow-up" />
                        <span style={{ marginLeft: '1rem' }}>Move Up</span>
                      </>
                    ),
                    onClick: () =>
                      onMoveSlide({ slideId, direction: 'up', interactiveId })
                  }
                ]),
            ...(cannotMoveDown
              ? []
              : [
                  {
                    label: (
                      <>
                        <Icon icon="arrow-down" />
                        <span style={{ marginLeft: '1rem' }}>Move Down</span>
                      </>
                    ),
                    onClick: () =>
                      onMoveSlide({ slideId, direction: 'down', interactiveId })
                  }
                ])
          ]),
      ...(isPublished
        ? []
        : [
            {
              label: (
                <>
                  <Icon icon="upload" />
                  <span style={{ marginLeft: '1rem' }}>Publish</span>
                </>
              ),
              onClick: handlePublishSlide
            }
          ]),
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
  }, [
    interactiveId,
    isPublished,
    isDeleted,
    slideId,
    cannotMoveDown,
    cannotMoveUp
  ]);

  return (
    <>
      {insertButtonShown && (
        <InsertSlide
          forkedFrom={forkedFrom}
          interactiveId={interactiveId}
          slideId={slideId}
          className={css`
            margin-top: 2rem;
            @media (max-width: ${mobileMaxWidth}) {
              margin-top: 1rem;
            }
          `}
        />
      )}
      <div
        ref={(ref) => innerRef(ref)}
        className={css`
          width: 100%;
          height: auto;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-left: 2rem;
          padding-right: 2rem;
          padding-top: ${isEditing ? '2rem' : '1rem'};
          margin-top: ${index === 0 ? 0 : canEdit ? '2rem' : '5rem'};
          background: #fff;
          border: 1px solid ${Color.borderGray()};
          border-radius: ${borderRadius};
          @media (max-width: ${mobileMaxWidth}) {
            margin-top: ${index === 0 ? 0 : canEdit ? '1rem' : '2rem'};
            border-left: 0;
            border-right: 0;
            border-radius: 0;
          }
        `}
        style={style}
      >
        {canEdit && !isEditing && !isDeleted && (
          <div className="dropdown-wrapper">
            <DropdownButton
              skeuomorphic
              color="darkerGray"
              direction="left"
              listStyle={{ width: '25ch' }}
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
            isLastSlide={isLastSlide}
            optionIds={optionIds}
            optionsObj={optionsObj}
            paths={paths}
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
