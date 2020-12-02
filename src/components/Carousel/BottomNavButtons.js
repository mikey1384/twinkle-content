import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

BottomNavButtons.propTypes = {
  currentSlide: PropTypes.number.isRequired,
  onPrev: PropTypes.func,
  onNext: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired,
  slideCount: PropTypes.number.isRequired,
  onCheckNavCondition: PropTypes.func
};
export default function BottomNavButtons({
  currentSlide,
  onPrev,
  onNext,
  onFinish,
  slideCount,
  onCheckNavCondition
}) {
  return (
    <div
      style={{
        display: 'flex',
        marginTop: '0.5rem',
        justifyContent: 'flex-end',
        width: '100%'
      }}
    >
      {onCheckNavCondition ? (
        <Button
          filled
          color="green"
          onClick={() => onCheckNavCondition(onNext)}
        >
          Check
        </Button>
      ) : (
        <>
          <Button
            style={{ marginRight: '0.5rem', fontSize: '1.7rem' }}
            onClick={onPrev}
            transparent
            disabled={currentSlide === 0}
          >
            Prev
          </Button>
          <Button
            filled
            style={{ fontSize: '1.7rem' }}
            onClick={currentSlide + 1 === slideCount ? onFinish : onNext}
            color={currentSlide + 1 === slideCount ? 'brownOrange' : 'green'}
          >
            {currentSlide + 1 === slideCount ? 'Finish' : 'Next'}
          </Button>
        </>
      )}
    </div>
  );
}
