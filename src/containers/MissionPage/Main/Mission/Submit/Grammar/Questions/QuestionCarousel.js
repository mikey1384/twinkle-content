import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Carousel from 'components/Carousel';
import QuestionSlide from './QuestionSlide';
import { scrollElementToCenter } from 'helpers';

QuestionCarousel.propTypes = {
  conditionPassStatus: PropTypes.string.isRequired,
  currentSlideIndex: PropTypes.number.isRequired,
  onAfterSlide: PropTypes.func.isRequired,
  onCheckNavCondition: PropTypes.func.isRequired,
  objectiveMessage: PropTypes.string.isRequired,
  questionIds: PropTypes.array.isRequired,
  questionObj: PropTypes.object.isRequired,
  onSelectChoice: PropTypes.func.isRequired
};

export default function QuestionCarousel({
  conditionPassStatus,
  currentSlideIndex,
  onAfterSlide,
  onCheckNavCondition,
  objectiveMessage,
  questionIds,
  questionObj,
  onSelectChoice
}) {
  const CarouselRef = useRef(null);
  useEffect(() => {
    scrollElementToCenter(CarouselRef.current, -200);
  }, []);
  return (
    <div ref={CarouselRef}>
      <Carousel
        allowDrag={false}
        conditionPassStatus={conditionPassStatus}
        progressBar
        slidesToShow={1}
        slidesToScroll={1}
        slideIndex={currentSlideIndex}
        afterSlide={onAfterSlide}
        onCheckNavCondition={onCheckNavCondition}
        title={
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              marginTop: '6rem',
              marginBottom: '-1rem'
            }}
          >
            <h2>{objectiveMessage}</h2>
          </div>
        }
      >
        {questionIds.map((questionId) => (
          <QuestionSlide
            key={questionId}
            question={questionObj[questionId].question}
            choices={questionObj[questionId].choices}
            answerIndex={questionObj[questionId].answerIndex}
            conditionPassStatus={conditionPassStatus}
            onSelectChoice={(selectedIndex) =>
              onSelectChoice({ selectedIndex, questionId })
            }
          />
        ))}
      </Carousel>
    </div>
  );
}
