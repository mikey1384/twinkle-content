import React, { useState } from 'react';
import QuestionSlide from './QuestionSlide';
import Carousel from 'components/Carousel';

const choices = [
  { label: 'graduate by', checked: false },
  { label: 'graduate from', checked: false },
  { label: 'graduating', checked: false },
  { label: 'graduating from', checked: false }
];

export default function Questions() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div>
      <Carousel
        allowDrag={false}
        progressBar
        slidesToShow={1}
        slidesToScroll={1}
        slideIndex={currentSlide}
        afterSlide={setCurrentSlide}
        onFinish={() => console.log('finished')}
        title={
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              marginTop: '6rem',
              marginBottom: '-1rem'
            }}
          >
            <h2>
              Choose the word or phrase that correctly completes the sentence
            </h2>
          </div>
        }
      >
        <QuestionSlide
          question="What year did you _____ university?"
          choices={choices}
        />
        <QuestionSlide
          question="What year did you _____ university?"
          choices={choices}
        />
      </Carousel>
    </div>
  );
}
