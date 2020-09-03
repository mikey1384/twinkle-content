import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import Slide from './Slide';
import Loading from 'components/Loading';
import { useAppContext, useInteractiveContext } from 'contexts';

InteractiveContent.propTypes = {
  contentId: PropTypes.number.isRequired
};

export default function InteractiveContent({ contentId }) {
  const {
    requestHelpers: { loadInteractive }
  } = useAppContext();
  const {
    state,
    actions: {
      onLoadInteractive,
      onConcatDisplayedSlides,
      onSetDisplayedSlides,
      onSetInteractiveState
    }
  } = useInteractiveContext();

  const { loaded, slideObj = {}, displayedSlides } = useMemo(
    () => state[contentId] || {},
    [contentId, state]
  );

  useEffect(() => {
    if (!loaded) {
      init();
    }
    async function init() {
      const interactive = await loadInteractive(contentId);
      onLoadInteractive(interactive);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId]);

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
      {displayedSlides.map((panelId, index) => (
        <Slide
          key={panelId}
          autoFocus={
            index > 0 && !!slideObj[displayedSlides[index - 1]]?.isFork
          }
          heading={slideObj[panelId].heading}
          onExpandPath={slideObj[panelId].isFork ? handleExpandPath : null}
          description={slideObj[panelId].description}
          options={slideObj[panelId].options}
          selectedOptionId={slideObj[panelId].selectedOptionId}
          panelId={panelId}
          paths={slideObj[panelId].paths}
          attachment={slideObj[panelId].attachment}
          style={{ marginTop: index === 0 ? 0 : '5rem' }}
        />
      ))}
    </div>
  ) : (
    <Loading />
  );

  function handleExpandPath({ newSlides, panelId, optionId }) {
    if (optionId !== slideObj[panelId].selectedOptionId) {
      if (slideObj[panelId].selectedOptionId) {
        const index = displayedSlides.indexOf(panelId);
        onSetDisplayedSlides({
          interactiveId: contentId,
          newSlides: displayedSlides.slice(0, index + 1)
        });
      }
      onSetInteractiveState({
        interactiveId: contentId,
        slideId: panelId,
        newState: { selectedOptionId: optionId }
      });
      onConcatDisplayedSlides({
        interactiveId: contentId,
        newSlides
      });
    }
  }
}
