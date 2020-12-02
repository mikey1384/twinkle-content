import React from 'react';
import QuestionSlide from './QuestionSlide';

const choices = [
  { label: 'graduate by', checked: false },
  { label: 'graduate from', checked: false },
  { label: 'graduating', checked: false },
  { label: 'graduating from', checked: false }
];

export default function Grammar() {
  return (
    <div>
      <QuestionSlide choices={choices} />
    </div>
  );
}
