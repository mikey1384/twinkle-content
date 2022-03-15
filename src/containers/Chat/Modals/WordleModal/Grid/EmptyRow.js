import React from 'react';
import { MAX_WORD_LENGTH } from '../constants/settings';
import Cell from './Cell';

export default function EmptyRow() {
  const emptyCells = Array.from(Array(MAX_WORD_LENGTH));

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '0.5rem'
      }}
    >
      {emptyCells.map((_, i) => (
        <Cell key={i} />
      ))}
    </div>
  );
}
