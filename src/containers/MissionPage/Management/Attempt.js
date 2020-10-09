import React from 'react';
import PropTypes from 'prop-types';
import FileViewer from 'components/FileViewer';
import { panel } from '../Styles';

Attempt.propTypes = {
  attempt: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function Attempt({ attempt, style }) {
  return (
    <div style={{ width: '100%', ...style }} className={panel}>
      <div>
        {attempt.userId}
        <FileViewer thumbUrl={attempt.thumbUrl} src={attempt.filePath} />
      </div>
    </div>
  );
}
