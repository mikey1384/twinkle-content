import React from 'react';
import PropTypes from 'prop-types';

Attempt.propTypes = {
  attempt: PropTypes.object.isRequired
};

export default function Attempt({ attempt }) {
  return (
    <div>
      <div>
        {attempt.fileName} {attempt.filePath}
      </div>
    </div>
  );
}
