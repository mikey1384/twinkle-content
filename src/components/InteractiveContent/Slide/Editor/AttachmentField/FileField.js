import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import FileViewer from '../../FileViewer';
import { css } from 'emotion';

FileField.propTypes = {
  fileUrl: PropTypes.string,
  onRemoveAttachment: PropTypes.func.isRequired
};

export default function FileField({ fileUrl, onRemoveAttachment }) {
  return (
    <div style={{ position: 'relative' }}>
      <Button
        skeuomorphic
        className={css`
          opacity: 0.9;
          &:hover {
            opacity: 1;
          }
        `}
        style={{
          position: 'absolute',
          right: 3,
          top: 3,
          padding: '0.6rem'
        }}
        onClick={onRemoveAttachment}
      >
        <Icon icon="times" size="lg" />
      </Button>
      <FileViewer src={fileUrl} />
    </div>
  );
}
