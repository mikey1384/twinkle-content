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
  archivedSlides: PropTypes.array,
  attachment: PropTypes.object,
  cannotMoveUp: PropTypes.bool,
  cannotMoveDown: PropTypes.bool,
  displayedSlideIds: PropTypes.array,
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
  isPortal: PropTypes.bool,
  forkedFrom: PropTypes.number,
  description: PropTypes.string,
  onExpandPath: PropTypes.func,
  onMoveSlide: PropTypes.func,
  forkButtonIds: PropTypes.array,
  forkButtonsObj: PropTypes.object,
  portalButton: PropTypes.object,
  slideId: PropTypes.number,
  slideObj: PropTypes.object,
  paths: PropTypes.object,
  selectedForkButtonId: PropTypes.number
};

export default function Slide({
  archivedSlides,
  cannotMoveUp,
  cannotMoveDown,
  displayedSlideIds,
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
  isPortal,
  forkedFrom,
  onExpandPath,
  onMoveSlide,
  forkButtonIds,
  forkButtonsObj,
  portalButton,
  slideId,
  paths,
  attachment,
  selectedForkButtonId,
  slideObj,
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
    actions: {
      onArchiveSlide,
      onChangeNumUpdates,
      onGoBack,
      onRemoveInteractiveSlide,
      onSetSlideState
    }
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
          onSetSlideState({
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
    displayedSlideIds,
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
          archivedSlides={archivedSlides}
          forkedFrom={forkedFrom}
          interactiveId={interactiveId}
          slideId={slideId}
          slideObj={slideObj}
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
            forkedFrom={forkedFrom}
            heading={heading}
            interactiveId={interactiveId}
            isFork={isFork}
            isPortal={isPortal}
            isLastSlide={isLastSlide}
            forkButtonIds={forkButtonIds}
            forkButtonsObj={forkButtonsObj}
            paths={paths}
            portalButton={portalButton}
            slideId={slideId}
            slideObj={slideObj}
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
            forkedFrom={forkedFrom}
            isPublished={isPublished}
            isPortal={isPortal}
            portalButton={portalButton}
            interactiveId={interactiveId}
            attachment={attachment}
            heading={heading}
            description={description}
            forkButtonIds={forkButtonIds}
            forkButtonsObj={forkButtonsObj}
            onForkButtonClick={handleForkButtonClick}
            onEmbedDataLoad={handleEmbedDataLoad}
            onPortalButtonClick={(forkId) =>
              onGoBack({ interactiveId, forkId })
            }
            onSetEmbedProps={handleSetEmbedProps}
            onThumbnailUpload={handleThumbnailUpload}
            paddingShown={paddingShown}
            slideId={slideId}
            selectedForkButtonId={selectedForkButtonId}
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
    const numUpdates = await deleteInteractiveSlide(slideId);
    onChangeNumUpdates({ interactiveId, numUpdates });
    onSetSlideState({
      interactiveId,
      slideId,
      newState: { isDeleted: true, selectedForkButtonId: null }
    });
    for (let [key, slide] of Object.entries(slideObj)) {
      if (slide.forkedFrom === slideId) {
        onArchiveSlide({ interactiveId, slideId: Number(key) });
      }
    }
  }

  function handleForkButtonClick(buttonId) {
    if (onExpandPath) {
      onExpandPath({ newSlides: paths[buttonId], slideId, buttonId });
    }
  }

  async function handlePublishSlide() {
    const numUpdates = await publishInteractiveSlide(slideId);
    onChangeNumUpdates({ interactiveId, numUpdates });
    onSetSlideState({
      interactiveId,
      slideId,
      newState: { isPublished: true }
    });
  }

  async function handleUnpublishSlide() {
    const numUpdates = await unPublishInteractiveSlide(slideId);
    onChangeNumUpdates({ interactiveId, numUpdates });
    onSetSlideState({
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
    const numUpdates = await updateEmbedData({
      slideId,
      thumbUrl,
      actualTitle,
      actualDescription,
      siteUrl
    });
    onChangeNumUpdates({ interactiveId, numUpdates });
  }

  async function handleSetEmbedProps(params) {
    onSetSlideState({
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
    onSetSlideState({
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
    const numUpdates = await undeleteInteractiveSlide(slideId);
    onChangeNumUpdates({ interactiveId, numUpdates });
    onSetSlideState({
      interactiveId,
      slideId,
      newState: { isDeleted: false }
    });
  }
}
