import React, { useEffect, useMemo, useRef } from 'react';
import { useMyState } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Slide from './Slide';
import Loading from 'components/Loading';
import BottomInterface from './BottomInterface';
import Button from 'components/Button';
import { useAppContext, useInteractiveContext, useViewContext } from 'contexts';
import { scrollElementToCenter } from 'helpers';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

InteractiveContent.propTypes = {
  interactiveId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default function InteractiveContent({ interactiveId }) {
  const {
    requestHelpers: {
      checkInteractiveNumUpdates,
      loadInteractive,
      moveInteractiveSlide
    }
  } = useAppContext();
  const {
    state: { pageVisible }
  } = useViewContext();
  const {
    state,
    actions: {
      onLoadInteractive,
      onChangeNumUpdates,
      onConcatDisplayedSlides,
      onMoveInteractiveSlide,
      onPublishInteractive,
      onSetDisplayedSlides,
      onSetSlideState
    }
  } = useInteractiveContext();
  const { canEdit, userId } = useMyState();

  const mounted = useRef(true);
  const expanded = useRef(false);
  const SlideRefs = useRef({});
  const prevDisplayedSlideIds = useRef([]);
  const BodyRef = useRef(document.scrollingElement || document.documentElement);

  const {
    numUpdates,
    currentUserId,
    loaded,
    slideObj = {},
    archivedSlideIds,
    displayedSlideIds,
    isPublished
  } = useMemo(() => state[interactiveId] || {}, [interactiveId, state]);

  const lastFork = useMemo(() => {
    const slides = displayedSlideIds?.map((slideId) => slideObj[slideId]);
    const forks = slides?.filter((slide) => slide.isFork && !slide.isDeleted);
    if (forks?.length > 0) {
      return forks[forks.length - 1];
    }
    return null;
  }, [displayedSlideIds, slideObj]);

  const archivedSlides = useMemo(() => {
    return archivedSlideIds?.map((slideId) => slideObj[slideId]);
  }, [archivedSlideIds, slideObj]);

  useEffect(() => {
    if (pageVisible) {
      handleCheckNumUpdates();
    }

    async function handleCheckNumUpdates() {
      if (loaded) {
        const newNumUpdates = await checkInteractiveNumUpdates(interactiveId);
        if (newNumUpdates > numUpdates) {
          const interactive = await loadInteractive(interactiveId);
          if (mounted.current) {
            onLoadInteractive({
              ...interactive,
              loaded: true,
              currentUserId: userId
            });
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageVisible]);

  useEffect(() => {
    if (
      expanded.current &&
      slideObj[displayedSlideIds[displayedSlideIds.length - 1]]?.forkedFrom
    ) {
      scrollElementToCenter(
        SlideRefs.current[
          displayedSlideIds.indexOf(
            slideObj[displayedSlideIds[displayedSlideIds.length - 1]].forkedFrom
          ) + 1
        ]
      );
    }
    expanded.current = false;
  }, [displayedSlideIds, slideObj]);

  useEffect(() => {
    if (displayedSlideIds?.length < prevDisplayedSlideIds?.current?.length) {
      scrollElementToCenter(SlideRefs.current[displayedSlideIds.length - 1]);
    }
    prevDisplayedSlideIds.current = displayedSlideIds;
  }, [displayedSlideIds]);

  useEffect(() => {
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    init();

    async function init() {
      if (interactiveId && userId && currentUserId !== userId) {
        const interactive = await loadInteractive(interactiveId);
        if (mounted.current) {
          onLoadInteractive({
            ...interactive,
            loaded: true,
            currentUserId: userId
          });
        }
      } else {
        onLoadInteractive({
          id: 0,
          loaded: true,
          numUpdates: 0,
          archivedSlideIds: [],
          displayedSlideIds: [],
          slideObj: {},
          isPublished: false,
          currentUserId: userId
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserId, interactiveId, loaded, userId]);

  return loaded ? (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '10rem'
      }}
    >
      {(isPublished || canEdit) && (
        <>
          {displayedSlideIds.map((slideId, index) => (
            <Slide
              {...slideObj[slideId]}
              key={slideId}
              archivedSlides={archivedSlides}
              displayedSlideIds={displayedSlideIds}
              index={index}
              innerRef={(ref) => (SlideRefs.current[index] = ref)}
              insertButtonShown={index !== 0 && canEdit}
              cannotMoveUp={
                index === 0 || !!slideObj[displayedSlideIds[index - 1]]?.isFork
              }
              cannotMoveDown={
                index === displayedSlideIds.length - 1 ||
                !!slideObj[displayedSlideIds[index + 1]]?.isFork
              }
              isDeleted={!!slideObj[slideId].isDeleted}
              isPublished={!!slideObj[slideId].isPublished}
              isFork={!!slideObj[slideId].isFork}
              isPortal={!!slideObj[slideId].isPortal}
              forkedFrom={slideObj[slideId].forkedFrom}
              interactiveId={interactiveId}
              onExpandPath={slideObj[slideId].isFork ? handleExpandPath : null}
              onMoveSlide={handleMoveInteractiveSlide}
              portalButton={slideObj[slideId].portalButton}
              slideId={slideId}
              slideObj={slideObj}
              isLastSlide={index === displayedSlideIds.length - 1}
            />
          ))}
        </>
      )}
      {loaded &&
        displayedSlideIds.length > 0 &&
        !slideObj[displayedSlideIds[displayedSlideIds.length - 1].isFork] && (
          <div
            style={{
              width: '100%',
              padding: '1rem',
              background: '#fff',
              display: 'flex',
              justifyContent: 'center'
            }}
            className={css`
              margin-top: 5rem;
              border: 1px solid ${Color.borderGray()};
              border-radius: ${borderRadius};
              @media (max-width: ${mobileMaxWidth}) {
                margin-top: 2rem;
                border-left: 0;
                border-right: 0;
                border-radius: 0;
              }
            `}
          >
            <Button
              skeuomorphic
              onClick={() => {
                document.getElementById('App').scrollTop = 0;
                BodyRef.current.scrollTop = 0;
              }}
            >
              Back to Top
            </Button>
          </div>
        )}
      {loaded && canEdit && (
        <BottomInterface
          archivedSlides={archivedSlides}
          isPublished={!!isPublished}
          interactiveId={interactiveId}
          lastFork={lastFork}
          onPublishInteractive={onPublishInteractive}
          className={css`
            margin-top: ${displayedSlideIds.length === 0 ? 0 : '5rem'};
            @media (max-width: ${mobileMaxWidth}) {
              margin-top: ${displayedSlideIds.length === 0 ? 0 : '2rem'};
            }
          `}
        />
      )}
    </div>
  ) : (
    <Loading />
  );

  function handleExpandPath({ newSlides, slideId, buttonId }) {
    if (buttonId !== slideObj[slideId].selectedForkButtonId) {
      onSetSlideState({
        interactiveId,
        slideId,
        newState: { selectedForkButtonId: buttonId }
      });
      if (
        newSlides.filter((slideId) => !slideObj[slideId].isDeleted).length > 0
      ) {
        expanded.current = true;
        if (slideObj[slideId].selectedForkButtonId) {
          const index = displayedSlideIds.indexOf(slideId);
          onSetDisplayedSlides({
            interactiveId,
            newSlides: displayedSlideIds.slice(0, index + 1)
          });
        }
        const validNewSlides = newSlides.filter(
          (slideId) => !!slideObj[slideId] && !slideObj[slideId]?.isDeleted
        );
        onConcatDisplayedSlides({
          interactiveId,
          newSlides: validNewSlides
        });
      }
    }
  }

  async function handleMoveInteractiveSlide({
    direction,
    interactiveId,
    slideId
  }) {
    const numUpdates = await moveInteractiveSlide({
      direction,
      forkedFrom: slideObj[slideId].forkedFrom,
      interactiveId,
      slideId
    });
    onChangeNumUpdates({ interactiveId, numUpdates });
    onMoveInteractiveSlide({ direction, interactiveId, slideId });
  }
}
