import React, { useEffect, useMemo, useRef } from 'react';
import { useMyState } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Slide from './Slide';
import Loading from 'components/Loading';
import BottomInterface from './BottomInterface';
import { useAppContext, useInteractiveContext } from 'contexts';

InteractiveContent.propTypes = {
  interactiveId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default function InteractiveContent({ interactiveId }) {
  const {
    requestHelpers: { loadInteractive }
  } = useAppContext();
  const { canEdit } = useMyState();
  const {
    state,
    actions: {
      onLoadInteractive,
      onConcatDisplayedSlides,
      onSetDisplayedSlides,
      onSetInteractiveState
    }
  } = useInteractiveContext();
  const mounted = useRef(true);

  const {
    loaded,
    slideObj = {},
    archivedSlideIds,
    displayedSlideIds,
    isPublished
  } = useMemo(() => state[interactiveId] || {}, [interactiveId, state]);

  const lastFork = useMemo(() => {
    const slides = displayedSlideIds?.map((slideId) => slideObj[slideId]);
    const forks = slides?.filter((slide) => slide.isFork);
    if (forks?.length > 0) {
      return forks[forks.length - 1];
    }
    return null;
  }, [displayedSlideIds, slideObj]);

  useEffect(() => {
    mounted.current = true;
    return function onUnmount() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) {
      init();
    }
    async function init() {
      if (interactiveId) {
        const interactive = await loadInteractive(interactiveId);
        if (mounted.current) {
          onLoadInteractive(interactive);
        }
      } else {
        onLoadInteractive({
          id: 0,
          loaded: true,
          archivedSlideIds: [],
          displayedSlideIds: [],
          slideObj: {},
          isPublished: false
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactiveId, loaded]);

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
              autoFocus={
                index > 0 && !!slideObj[displayedSlideIds[index - 1]]?.isFork
              }
              isDeleted={!!slideObj[slideId].isDeleted}
              isPublished={!!slideObj[slideId].isPublished}
              isFork={!!slideObj[slideId].isFork}
              onExpandPath={slideObj[slideId].isFork ? handleExpandPath : null}
              interactiveId={interactiveId}
              slideId={slideId}
              style={{ marginTop: index === 0 ? 0 : '5rem' }}
            />
          ))}
        </>
      )}
      {loaded && !isPublished && canEdit && (
        <BottomInterface
          archivedSlides={archivedSlideIds.map((slideId) => slideObj[slideId])}
          interactiveId={interactiveId}
          lastFork={lastFork}
          style={{ marginTop: displayedSlideIds.length === 0 ? 0 : '5rem' }}
        />
      )}
    </div>
  ) : (
    <Loading />
  );

  function handleExpandPath({ newSlides, slideId, optionId }) {
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
      const validNewSlides = newSlides.filter((slideId) => !!slideObj[slideId]);
      onConcatDisplayedSlides({
        interactiveId,
        newSlides: validNewSlides
      });
    }
  }
}
