import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';

Googling.propTypes = {
  style: PropTypes.object
};
export default function Googling({ style }) {
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
      <p>When did World War 2 begin?</p>
      <p>Who was the third prime minister of India?</p>
      <p>When was Isaac Newton born?</p>
      <p>What is the speed of light?</p>
      <p>What is 질산나트륨 in english?</p>
      <p>{`What language is this, and what does it mean? "brilha Brilha Estrelinha"`}</p>
      <p>Where was Mozzarella cheese sticks invented?</p>
    </div>
  );
}
