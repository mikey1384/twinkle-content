import React, { useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import ContentFileViewer from 'components/ContentFileViewer';
import LocalContext from '../../Context';
import { getFileInfoFromFileName } from 'helpers/stringHelpers';

FileAttachment.propTypes = {
  content: PropTypes.string,
  messageId: PropTypes.number,
  fileName: PropTypes.string,
  filePath: PropTypes.string,
  fileSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  thumbUrl: PropTypes.string
};

export default function FileAttachment({
  content,
  messageId,
  fileName,
  filePath,
  fileSize,
  thumbUrl
}) {
  const {
    actions: { onSetMediaStarted }
  } = useContext(LocalContext);
  const fileViewerMarginBottom = useMemo(
    () => getFileInfoFromFileName(fileName)?.fileType === 'audio' && '2rem',
    [fileName]
  );

  useEffect(() => {
    return function cleanUp() {
      onSetMediaStarted({
        contentType: 'chat',
        contentId: messageId,
        started: false
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ContentFileViewer
      contentId={messageId}
      contentType="chat"
      content={content}
      filePath={filePath}
      fileName={fileName}
      fileSize={fileSize}
      onMediaPause={() =>
        onSetMediaStarted({
          contentType: 'chat',
          contentId: messageId,
          started: false
        })
      }
      onMediaPlay={() =>
        onSetMediaStarted({
          contentType: 'chat',
          contentId: messageId,
          started: true
        })
      }
      thumbUrl={thumbUrl}
      style={{
        marginTop: '1rem',
        marginBottom: fileViewerMarginBottom
      }}
    />
  );
}
