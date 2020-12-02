import React, { useState } from 'react';
import QuestionSlide from './QuestionSlide';
import Carousel from 'components/Carousel';

const choices = [
  { label: 'graduate by', checked: false },
  { label: 'graduate from', checked: false },
  { label: 'graduating', checked: false },
  { label: 'graduating from', checked: false }
];

export default function Grammar() {
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
      >
        <QuestionSlide choices={choices} />
      </Carousel>
    </div>
  );
}
