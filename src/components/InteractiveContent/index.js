import React, { useEffect, useMemo, useRef } from 'react';
import { useMyState } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Slide from './Slide';
import Loading from 'components/Loading';
import BottomInterface from './BottomInterface';
import Button from 'components/Button';
import { useAppContext, useInteractiveContext, useViewContext } from 'contexts';
import { scrollElementToCenter, scrollElementTo } from 'helpers';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';

InteractiveContent.propTypes = {
  autoFocus: PropTypes.bool,
  interactiveId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default function InteractiveContent({ autoFocus, interactiveId }) {
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
    prevUserId,
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
              prevUserId: userId
            });
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageVisible]);

  useEffect(() => {
    if (autoFocus && displayedSlideIds?.length === 1) {
      scrollElementToCenter(
        SlideRefs.current[slideObj[displayedSlideIds[0]].id]
      );
    }
  }, [autoFocus, displayedSlideIds, slideObj]);

  useEffect(() => {
    if (
      expanded.current &&
      slideObj[displayedSlideIds[displayedSlideIds.length - 1]]?.forkedFrom
    ) {
      setTimeout(() => {
        scrollElementTo({
          element:
            SlideRefs.current[
              slideObj[
                displayedSlideIds[
                  displayedSlideIds.indexOf(
                    slideObj[displayedSlideIds[displayedSlideIds.length - 1]]
                      .forkedFrom
                  ) + 1
                ]
              ].id
            ],
          amount: 100
        });
      }, 10);
    }
    expanded.current = false;
  }, [displayedSlideIds, slideObj]);

  useEffect(() => {
    if (displayedSlideIds?.length < prevDisplayedSlideIds?.current?.length) {
      if (
        displayedSlideIds[displayedSlideIds.length - 1] !==
        prevDisplayedSlideIds.current[prevDisplayedSlideIds.current.length - 1]
      ) {
        scrollElementToCenter(
          SlideRefs.current[
            slideObj[displayedSlideIds[displayedSlideIds.length - 1]].id
          ]
        );
      }
    }
    prevDisplayedSlideIds.current = displayedSlideIds;
  }, [displayedSlideIds, slideObj]);

  useEffect(() => {
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    init();

    async function init() {
      if (interactiveId && userId && prevUserId !== userId) {
        const interactive = await loadInteractive(interactiveId);
        if (mounted.current) {
          onLoadInteractive({
            ...interactive,
            loaded: true,
            prevUserId: userId
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
          prevUserId: userId
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevUserId, interactiveId, loaded, userId]);

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
              innerRef={(ref) => (SlideRefs.current[slideId] = ref)}
              insertButtonShown={canEdit}
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
              style={{ fontSize: '1.7rem' }}
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
      }
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
      for (let slideId of validNewSlides) {
        onSetSlideState({
          interactiveId,
          slideId,
          newState: { selectedForkButtonId: null }
        });
      }
      onConcatDisplayedSlides({
        interactiveId,
        newSlides: validNewSlides
      });
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
