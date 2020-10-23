import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { css } from 'emotion';
import { useAppContext, useInteractiveContext } from 'contexts';
import Icon from 'components/Icon';
import SelectArchivedSlideModal from '../SelectArchivedSlideModal';

InsertSlide.propTypes = {
  archivedSlides: PropTypes.array,
  forkedFrom: PropTypes.number,
  interactiveId: PropTypes.number,
  slideId: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object
};

export default function InsertSlide({
  archivedSlides,
  interactiveId,
  forkedFrom,
  slideId,
  className,
  style
}) {
  const {
    requestHelpers: { insertInteractiveSlide }
  } = useAppContext();
  const {
    actions: { onInsertInteractiveSlide }
  } = useInteractiveContext();
  const [
    selectArchivedSlideModalShown,
    setSelectArchivedSlideModalShown
  ] = useState(false);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}
    >
      <div
        className={`unselectable ${css`
          &:hover {
            font-weight: bold;
          }
        `}`}
        style={{
          width: 'auto',
          padding: '0.5rem',
          background: '#fff',
          textAlign: 'center',
          border: `1px solid ${Color.borderGray()}`,
          cursor: 'pointer',
          ...style
        }}
        onClick={handleInsertSlide}
      >
        <Icon icon="plus" />
        <span style={{ marginLeft: '0.7rem', fontSize: '1.2rem' }}>
          insert{archivedSlides.length > 0 ? ' new' : ''}
        </span>
      </div>
      {archivedSlides.length > 0 && (
        <div
          className={`unselectable ${css`
            &:hover {
              font-weight: bold;
            }
          `}`}
          style={{
            marginLeft: '1rem',
            padding: '0.5rem',
            background: '#fff',
            textAlign: 'center',
            border: `1px solid ${Color.borderGray()}`,
            cursor: 'pointer',
            ...style
          }}
          onClick={() => setSelectArchivedSlideModalShown(true)}
        >
          <Icon icon="archive" />
          <span style={{ marginLeft: '0.7rem', fontSize: '1.2rem' }}>
            archived
          </span>
        </div>
      )}
      {selectArchivedSlideModalShown && (
        <SelectArchivedSlideModal
          interactiveId={interactiveId}
          archivedSlides={archivedSlides}
          onDone={handleInsertArchivedSlide}
          onHide={() => setSelectArchivedSlideModalShown(false)}
        />
      )}
    </div>
  );

  async function handleInsertArchivedSlide(selectedSlideId) {
    console.log(selectedSlideId);
  }

  async function handleInsertSlide() {
    const newSlide = await insertInteractiveSlide({
      interactiveId,
      forkedFrom,
      slideId
    });
    onInsertInteractiveSlide({
      interactiveId,
      forkedFrom,
      slideId,
      newSlide
    });
  }
}
