import React from 'react';
import PropTypes from 'prop-types';

MissionContent.propTypes = {
  rootObj: PropTypes.object.isRequired
};

export default function MissionContent({ rootObj }) {
  return (
    <div>
      <div>{rootObj.title}</div>
    </div>
  );
}
