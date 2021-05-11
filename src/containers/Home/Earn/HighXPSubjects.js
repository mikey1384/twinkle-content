import React from 'react';
import PropTypes from 'prop-types';
import { panel } from './Styles';

HighXPSubjects.propTypes = {
  style: PropTypes.object
};

export default function HighXPSubjects({ style }) {
  return (
    <div style={style} className={panel}>
      <p>{`Today's High XP Subjects`}</p>
    </div>
  );
}
