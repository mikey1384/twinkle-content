import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import FileInfo from './FileInfo';
import { Color, borderRadius } from 'constants/css';
import { getFileInfoFromFileName } from 'helpers/stringHelpers';

TargetMessagePreview.propTypes = {
  onClose: PropTypes.func.isRequired,
  replyTarget: PropTypes.object
};

export default function TargetMessagePreview({ onClose, replyTarget }) {
  const fileType = useMemo(() => {
    return replyTarget.fileName
      ? getFileInfoFromFileName(replyTarget.fileName)?.fileType
      : null;
  }, [replyTarget.fileName]);

  return (
    <div
      style={{
        height: '12rem',
        width: '100%',
        position: 'relative',
        padding: '1rem 6rem 2rem 0.5rem',
        marginBottom: '2px'
      }}
    >
      <Icon
        icon="times"
        size="lg"
        style={{
          position: 'absolute',
          right: '1.7rem',
          top: '4rem',
          cursor: 'pointer'
        }}
        onClick={onClose}
      />
      <div
        style={{
          padding: '1rem',
          height: '100%',
          width: '100%',
          background: Color.targetGray(),
          borderRadius,
          overflow: 'scroll',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <p
            style={{
              fontWeight: 'bold',
              color: Color.black()
            }}
          >
            {replyTarget.username}
          </p>
          <div style={{ marginTop: '0.5rem', paddingBottom: '1rem' }}>
            {replyTarget.content || replyTarget.fileName}
          </div>
        </div>
        {fileType && replyTarget.fileName && (
          <FileInfo
            filePath={replyTarget.filePath}
            fileType={fileType}
            fileName={replyTarget.fileName}
            thumbUrl={replyTarget.thumbUrl}
          />
        )}
      </div>
    </div>
  );
}
