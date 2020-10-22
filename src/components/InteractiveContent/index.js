import React, { useEffect, useMemo, useRef } from 'react';
import { useMyState } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Slide from './Slide';
import Loading from 'components/Loading';
import BottomInterface from './BottomInterface';
import { useAppContext, useInteractiveContext } from 'contexts';
import { scrollElementToCenter } from 'helpers';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

InteractiveContent.propTypes = {
  interactiveId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default function InteractiveContent({ interactiveId }) {
  const {
    requestHelpers: { loadInteractive, moveInteractiveSlide }
  } = useAppContext();
  const { canEdit, userId } = useMyState();
  const {
    state,
    actions: {
      onLoadInteractive,
      onConcatDisplayedSlides,
      onMoveInteractiveSlide,
      onPublishInteractive,
      onSetDisplayedSlides,
      onSetInteractiveState
    }
  } = useInteractiveContext();
  const mounted = useRef(true);
  const expanded = useRef(false);
  const SlideRefs = useRef({});

  const {
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

  useEffect(() => {
    if (expanded.current && lastFork?.id) {
      scrollElementToCenter(
        SlideRefs.current[displayedSlideIds.indexOf(lastFork.id) + 1]
      );
    }
    expanded.current = false;
  }, [displayedSlideIds, lastFork]);

  useEffect(() => {
    mounted.current = true;
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
              forkedFrom={slideObj[slideId].forkedFrom}
              interactiveId={interactiveId}
              onExpandPath={slideObj[slideId].isFork ? handleExpandPath : null}
              onMoveSlide={handleMoveInteractiveSlide}
              slideId={slideId}
              slideObj={slideObj}
              isLastSlide={index === displayedSlideIds.length - 1}
            />
          ))}
        </>
      )}
      {loaded && canEdit && (
        <BottomInterface
          archivedSlides={archivedSlideIds.map((slideId) => slideObj[slideId])}
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

  function handleExpandPath({ newSlides, slideId, optionId }) {
    expanded.current = true;
    if (optionId !== slideObj[slideId].selectedOptionId) {
      if (slideObj[slideId].selectedOptionId) {
        const index = displayedSlideIds.indexOf(slideId);
        onSetDisplayedSlides({
          interactiveId,
          newSlides: displayedSlideIds.slice(0, index + 1)
        });
      }
      onSetInteractiveState({
        interactiveId,
        slideId,
        newState: { selectedOptionId: optionId }
      });
      const validNewSlides = newSlides.filter(
        (slideId) => !!slideObj[slideId] && !slideObj[slideId]?.isDeleted
      );
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
    await moveInteractiveSlide({
      direction,
      forkedFrom: slideObj[slideId].forkedFrom,
      interactiveId,
      slideId
    });
    onMoveInteractiveSlide({ direction, interactiveId, slideId });
  }
}
