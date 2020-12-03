import React, { useEffect, useRef, useState } from 'react';
import QuestionSlide from './QuestionSlide';
import Carousel from 'components/Carousel';
import { scrollElementToCenter } from 'helpers';

const questionObj = {
  0: {
    objective:
      'Choose the word or phrase that correctly completes the sentence',
    question: 'What year did you _____ university?',
    choices: [
      { label: 'graduate by', checked: false },
      { label: 'graduate from', checked: false },
      { label: 'graduating', checked: false },
      { label: 'graduating from', checked: false }
    ]
  },
  1: {
    objective: 'Another objective',
    question: 'What year did you _____ university?',
    choices: [
      { label: 'graduate by', checked: false },
      { label: 'graduate from', checked: false },
      { label: 'graduating', checked: false },
      { label: 'graduating from', checked: false }
    ]
  }
};

const questionIds = [0, 1];

export default function Questions() {
  const QuestionsRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [conditionPassStatus, setConditionPassStatus] = useState('');
  useEffect(() => {
    scrollElementToCenter(QuestionsRef.current);
  }, []);

  return (
    <div ref={QuestionsRef}>
      <Carousel
        allowDrag={false}
        conditionPassStatus={conditionPassStatus}
        progressBar
        slidesToShow={1}
        slidesToScroll={1}
        slideIndex={currentSlide}
        afterSlide={(index) => {
          setConditionPassStatus('');
          setCurrentSlide(index);
        }}
        onFinish={() => console.log('finished')}
        onCheckNavCondition={handleCheckNavCondition}
        title={
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              marginTop: '6rem',
              marginBottom: '-1rem'
            }}
          >
            <h2>{questionObj[currentSlide].objective}</h2>
          </div>
        }
      >
        {questionIds.map((questionId) => (
          <QuestionSlide
            key={questionId}
            question={questionObj[questionId].question}
            choices={questionObj[questionId].choices}
          />
        ))}
      </Carousel>
    </div>
  );

  function handleCheckNavCondition() {
    setConditionPassStatus('fail');
  }
}
