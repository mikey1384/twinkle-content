import React from 'react';
import PropTypes from 'prop-types';
import LongText from 'components/Texts/LongText';

Bio.propTypes = {
  firstRow: PropTypes.string,
  secondRow: PropTypes.string,
  thirdRow: PropTypes.string,
  small: PropTypes.bool,
  style: PropTypes.object
};

export default function Bio({ firstRow, secondRow, thirdRow, small, style }) {
  return (
    <ul
      style={{
        display: 'flex',
        marginTop: '2rem',
        flexDirection: 'column',
        justifyContent: 'center',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
        paddingLeft: '2rem',
        lineHeight: 1.6,
        fontSize: small ? '1.5rem' : '1.7rem',
        ...style
      }}
    >
      {firstRow && (
        <li>
          <LongText>{firstRow}</LongText>
        </li>
      )}
      {secondRow && (
        <li>
          <LongText>{secondRow}</LongText>
        </li>
      )}
      {thirdRow && (
        <li>
          <LongText>{thirdRow}</LongText>
        </li>
      )}
    </ul>
  );
}
