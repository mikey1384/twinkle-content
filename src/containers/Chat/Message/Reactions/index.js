import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Reaction from './Reaction';

Reactions.propTypes = {
  reactions: PropTypes.array
};

export default function Reactions({ reactions }) {
  const reactionList = useMemo(() => {
    const result = [];
    if (!reactions) return result;
    for (const reaction of reactions) {
      if (!result.includes(reaction.type)) {
        result.push(reaction.type);
      }
    }
    return result;
  }, [reactions]);

  return (
    <div style={{ height: '2rem', display: 'flex' }}>
      {reactionList.map((reaction) => (
        <Reaction key={reaction} reaction={reaction} />
      ))}
    </div>
  );
}
