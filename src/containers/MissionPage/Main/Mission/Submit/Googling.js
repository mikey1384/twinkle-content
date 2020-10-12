import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import { css } from 'emotion';

Googling.propTypes = {
  style: PropTypes.object
};
export default function Googling({ style }) {
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [answer4, setAnswer4] = useState('');
  const [answer5, setAnswer5] = useState('');
  const [answer6, setAnswer6] = useState('');
  const [answer7, setAnswer7] = useState('');
  const [answer8, setAnswer8] = useState('');

  return (
    <div
      className={css`
        > p {
          font-size: 1.5rem;
          font-weight: bold;
        }
      `}
      style={style}
    >
      <p>What is the rarest element on Earth?</p>
      <Input
        autoFocus
        value={answer1}
        onChange={(text) => setAnswer1(text)}
        style={{ marginTop: '0.5rem', marginBottom: '2rem' }}
        placeholder="Type your answer here..."
      />
      <p>When did World War 2 begin?</p>
      <Input
        autoFocus
        value={answer2}
        onChange={(text) => setAnswer2(text)}
        style={{ marginTop: '0.5rem', marginBottom: '2rem' }}
        placeholder="Type your answer here..."
      />
      <p>Who was the third prime minister of India?</p>
      <Input
        autoFocus
        value={answer3}
        onChange={(text) => setAnswer3(text)}
        style={{ marginTop: '0.5rem', marginBottom: '2rem' }}
        placeholder="Type your answer here..."
      />
      <p>When was Isaac Newton born?</p>
      <Input
        autoFocus
        value={answer4}
        onChange={(text) => setAnswer4(text)}
        style={{ marginTop: '0.5rem', marginBottom: '2rem' }}
        placeholder="Type your answer here..."
      />
      <p>What is the speed of light?</p>
      <Input
        autoFocus
        value={answer5}
        onChange={(text) => setAnswer5(text)}
        style={{ marginTop: '0.5rem', marginBottom: '2rem' }}
        placeholder="Type your answer here..."
      />
      <p>What is 질산나트륨 in english?</p>
      <Input
        autoFocus
        value={answer6}
        onChange={(text) => setAnswer6(text)}
        style={{ marginTop: '0.5rem', marginBottom: '2rem' }}
        placeholder="Type your answer here..."
      />
      <p>{`What language is this, and what does it mean? "brilha Brilha Estrelinha"`}</p>
      <Input
        autoFocus
        value={answer7}
        onChange={(text) => setAnswer7(text)}
        style={{ marginTop: '0.5rem', marginBottom: '2rem' }}
        placeholder="Type your answer here..."
      />
      <p>Where was Mozzarella cheese sticks invented?</p>
      <Input
        autoFocus
        value={answer8}
        onChange={(text) => setAnswer8(text)}
        style={{ marginTop: '0.5rem', marginBottom: '-1rem' }}
        placeholder="Type your answer here..."
      />
    </div>
  );
}
