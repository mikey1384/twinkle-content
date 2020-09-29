import React, { useEffect, useMemo, useRef } from 'react';
import { useMyState } from 'helpers/hooks';
import PropTypes from 'prop-types';
import Slide from './Slide';
import Loading from 'components/Loading';
import AddSlide from './AddSlide';
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

  const { loaded, slideObj = {}, displayedSlides, isPublished } = useMemo(
    () => state[interactiveId] || {},
    [interactiveId, state]
  );

  const lastFork = useMemo(() => {
    const slides = displayedSlides?.map((slideId) => slideObj[slideId]);
    const forks = slides?.filter((slide) => slide.isFork);
    if (forks?.length > 0) {
      return forks[forks.length - 1];
    }
    return null;
  }, [displayedSlides, slideObj]);

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
      if (interactiveId && interactiveId !== 'new') {
        const interactive = await loadInteractive(interactiveId);
        if (mounted.current) {
          onLoadInteractive(interactive);
        }
      } else {
        onLoadInteractive({
          id: 'new',
          loaded: true,
          displayedSlides: [],
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
          {displayedSlides.map((slideId, index) => (
            <Slide
              {...slideObj[slideId]}
              key={slideId}
              autoFocus={
                index > 0 && !!slideObj[displayedSlides[index - 1]]?.isFork
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
        <AddSlide
          interactiveId={interactiveId}
          lastFork={lastFork}
          style={{ marginTop: displayedSlides.length === 0 ? 0 : '5rem' }}
        />
      )}
    </div>
  ) : (
    <Loading />
  );

  function handleExpandPath({ newSlides, slideId, optionId }) {
    if (optionId !== slideObj[slideId].selectedOptionId) {
      if (slideObj[slideId].selectedOptionId) {
        const index = displayedSlides.indexOf(slideId);
        onSetDisplayedSlides({
          interactiveId,
          newSlides: displayedSlides.slice(0, index + 1)
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
