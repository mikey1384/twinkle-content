import React, { useEffect, useRef, useState } from 'react';
import QuestionSlide from './QuestionSlide';
import Carousel from 'components/Carousel';
import { scrollElementToCenter } from 'helpers';

const questionIds = [0, 1, 2, 3, 4, 5];
export default function Questions() {
  const [questionObj, setQuestionObj] = useState({
    0: {
      id: 0,
      objective:
        'Choose the word or phrase that correctly completes the sentence',
      question: 'What year did you _____ university?',
      choices: [
        { label: 'graduate by', checked: false },
        { label: 'graduate from', checked: false },
        { label: 'graduating', checked: false },
        { label: 'graduating from', checked: false }
      ],
      answerIndex: 1,
      selectedChoiceIndex: null
    },
    1: {
      id: 1,
      objective:
        'Choose the word or phrase that correctly completes the sentence',
      question:
        'It seems to be getting worse. You had better _____ a specialist.',
      choices: [
        { label: 'consult', checked: false },
        { label: 'consult to', checked: false },
        { label: 'consult for', checked: false },
        { label: 'consult by', checked: false }
      ],
      answerIndex: 0,
      selectedChoiceIndex: null
    },
    2: {
      id: 2,
      objective:
        'Choose the word or phrase that correctly completes the sentence',
      question: 'Chicago is a large city, _____?',
      choices: [
        { label: `aren't it`, checked: false },
        { label: `doesn't it`, checked: false },
        { label: `won't it`, checked: false },
        { label: `isn't it`, checked: false }
      ],
      answerIndex: 3,
      selectedChoiceIndex: null
    },
    3: {
      id: 3,
      objective:
        'Choose the word or phrase that correctly completes the sentence',
      question: `Don't leave your books near the open fire. They might easily _____.`,
      choices: [
        { label: 'catch to fire', checked: false },
        { label: 'catch the fire', checked: false },
        { label: 'catch on fire', checked: false },
        { label: 'catch with fire', checked: false }
      ],
      answerIndex: 2,
      selectedChoiceIndex: null
    },
    4: {
      id: 4,
      objective:
        'Choose the word or phrase that correctly completes the sentence',
      question: 'Do you enjoy _____?',
      choices: [
        { label: 'to swim', checked: false },
        { label: 'swimming', checked: false },
        { label: 'swim', checked: false },
        { label: 'to swimming', checked: false }
      ],
      answerIndex: 1,
      selectedChoiceIndex: null
    },
    5: {
      id: 5,
      objective:
        'Choose the word or phrase that correctly completes the sentence',
      question: 'I have trouble _____.',
      choices: [
        { label: 'to remember my password', checked: false },
        { label: 'to remembering my password', checked: false },
        { label: 'remember my password', checked: false },
        { label: 'remembering my password', checked: false }
      ],
      answerIndex: 3,
      selectedChoiceIndex: null
    }
  });
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
            onSelectChoice={(selectedIndex) =>
              setQuestionObj((questionObj) => ({
                ...questionObj,
                [questionId]: {
                  ...questionObj[questionId],
                  choices: questionObj[
                    questionId
                  ].choices.map((choice, index) =>
                    index === selectedIndex
                      ? { ...choice, checked: true }
                      : { ...choice, checked: false }
                  )
                },
                selectedChoiceIndex: selectedIndex
              }))
            }
          />
        ))}
      </Carousel>
    </div>
  );

  function handleCheckNavCondition() {
    setConditionPassStatus('fail');
  }
}
