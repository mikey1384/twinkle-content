import React from 'react';
import PropTypes from 'prop-types';
import LongText from 'components/Texts/LongText';

Caption.propTypes = {
  caption: PropTypes.string
};

export default function Caption({ caption }) {
  return <LongText style={{ marginTop: '2rem' }}>{caption}</LongText>;
}
