import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';

Question.propTypes = {
  style: PropTypes.object
};
export default function Question({ style }) {
  const [answer, setAnswer] = useState('');
  return (
    <div style={style}>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        What is the rarest element on Earth?
      </p>
      <Input
        autoFocus
        value={answer}
        onChange={(text) => setAnswer(text)}
        style={{ marginTop: '0.5rem', marginBottom: '2rem' }}
        placeholder="Type your answer here..."
      />
    </div>
  );
}
