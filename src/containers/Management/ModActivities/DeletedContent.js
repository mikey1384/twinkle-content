import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import ContentFileViewer from 'components/ContentFileViewer';
import VideoThumbImage from 'components/VideoThumbImage';
import Embedly from 'components/Embedly';
import UsernameText from 'components/Texts/UsernameText';
import ReactPlayer from 'react-player';
import Button from 'components/Button';
import Loading from 'components/Loading';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { css } from '@emotion/css';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { useAppContext } from 'contexts';

DeletedContent.propTypes = {
  contentId: PropTypes.number,
  contentType: PropTypes.string,
  style: PropTypes.object
};

export default function DeletedContent({ contentId, contentType, style }) {
  const {
    requestHelpers: { loadDeletedContent }
  } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const [contentObj, setContentObj] = useState({});
  const {
    actualTitle,
    actualDescription,
    content,
    deleter,
    description,
    fileName,
    filePath,
    fileSize,
    rootObj,
    secretAnswer,
    title,
    thumbUrl,
    uploader = {}
  } = useMemo(() => contentObj, [contentObj]);
  useEffect(() => {
    init();
    async function init() {
      setLoading(true);
      const data = await loadDeletedContent({ contentId, contentType });
      setContentObj(data);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        borderRadius,
        height: 'auto',
        ...style
      }}
      className={css`
        border: 1px solid ${Color.borderGray()};
        background: '#fff';
        .label {
          color: ${Color.black()};
        }
        margin-top: 0;
        @media (max-width: ${mobileMaxWidth}) {
          margin-top: -0.5rem;
          border-left: 0;
          border-right: 0;
        }
      `}
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <div style={{ padding: '1rem', height: 'auto' }}>
            <div
              style={{
                display: 'flex',
                width: '100%',
                fontSize: '1.3rem',
                height: 'auto'
              }}
            >
              {contentType === 'video' && (
                <div>
                  <div>
                    <UsernameText
                      style={{ fontSize: '1.5rem' }}
                      user={uploader}
                    />
                  </div>
                  <p
                    style={{
                      marginTop: '1rem',
                      fontSize: '1.7rem',
                      fontWeight: 'bold',
                      lineHeight: 1.5,
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word'
                    }}
                    className="label"
                  >
                    {title}
                  </p>
                  <div
                    style={{
                      marginTop: '1rem',
                      color: Color.darkerGray(),
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {description}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      position: 'relative',
                      height: 'auto'
                    }}
                  >
                    <ReactPlayer
                      style={{ position: 'relative' }}
                      url={`https://www.youtube.com/watch?v=${content}`}
                      controls
                    />
                  </div>
                </div>
              )}
              {contentType === 'comment' && (
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'column'
                  }}
                >
                  <div>
                    <UsernameText
                      style={{ fontSize: '1.5rem' }}
                      user={uploader}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: '1rem',
                      fontSize: '1.5rem',
                      width: '100%',
                      textAlign: 'left',
                      color: Color.darkerGray(),
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {content}
                  </div>
                </div>
              )}
              {contentType === 'subject' && (
                <div>
                  <div>
                    <UsernameText
                      style={{ fontSize: '1.5rem' }}
                      user={uploader}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      width: '100%'
                    }}
                  >
                    <div
                      className="label"
                      style={{
                        width: '100%',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                    >
                      <p style={{ lineClamp: 2, fontSize: '2.5rem' }}>
                        {title}
                      </p>
                      {uploader.username && (
                        <p style={{ color: Color.gray() }}>
                          Posted by {uploader.username}
                        </p>
                      )}
                      {description && (
                        <div
                          style={{
                            marginTop: '1rem',
                            width: '100%',
                            textAlign: 'left',
                            color: Color.darkerGray(),
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'break-word',
                            wordBreak: 'break-word',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {contentType === 'url' && (
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div>
                    <UsernameText
                      style={{ fontSize: '1.5rem' }}
                      user={uploader}
                    />
                  </div>
                  <div>
                    <span
                      style={{
                        marginTop: '1rem',
                        fontSize: '1.7rem',
                        fontWeight: 'bold',
                        lineHeight: 1.5,
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                      className="label"
                    >
                      {title}
                    </span>
                    <div>
                      <Embedly
                        small
                        noLink
                        style={{ marginTop: '0.5rem' }}
                        contentId={contentId}
                        directUrl={content}
                        defaultThumbUrl={thumbUrl}
                        defaultActualTitle={actualTitle}
                        defaultActualDescription={actualDescription}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {contentType === 'subject' && rootObj?.id && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '25%',
                  marginBottom: secretAnswer ? '1rem' : ''
                }}
              >
                {rootObj?.contentType === 'video' && (
                  <VideoThumbImage
                    rewardLevel={rootObj.rewardLevel}
                    videoId={rootObj.id}
                    src={`https://img.youtube.com/vi/${rootObj.content}/mqdefault.jpg`}
                  />
                )}
                {rootObj?.contentType === 'url' && (
                  <Embedly imageOnly noLink contentId={rootObj?.id} />
                )}
              </div>
            )}
            {filePath && (
              <ContentFileViewer
                contentId={contentId}
                contentType={contentType}
                fileName={fileName}
                filePath={filePath}
                fileSize={fileSize}
                thumbUrl={thumbUrl}
                videoHeight="100%"
                isThumb
                style={{
                  display: 'flex',
                  width: '15rem',
                  height: '11rem'
                }}
              />
            )}
          </div>
          {secretAnswer && (
            <div
              style={{
                padding: '1rem',
                background: Color.ivory(),
                borderTop: `1px solid ${Color.borderGray()}`,
                borderBottom: `1px solid ${Color.borderGray()}`
              }}
            >
              {secretAnswer}
            </div>
          )}
          {deleter && (
            <div
              style={{
                marginTop: '1rem',
                padding: '1rem',
                background: Color.darkerGray(),
                marginLeft: '-1px',
                marginRight: '-1px',
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                Deleted by{' '}
                <UsernameText
                  color="#fff"
                  style={{ fontSize: '1.5rem' }}
                  user={deleter}
                />
              </div>
              <div style={{ display: 'flex' }}>
                <Button
                  onClick={() => setConfirmModalShown(true)}
                  color="red"
                  skeuomorphic
                >
                  Delete Permanently
                </Button>
                <Button
                  onClick={handleUndoDelete}
                  color="darkerGray"
                  style={{ marginLeft: '1rem' }}
                  skeuomorphic
                >
                  Undo
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      {confirmModalShown && (
        <ConfirmModal
          onHide={() => setConfirmModalShown(false)}
          title="Delete Content Permanently"
          onConfirm={handleDeletePermanently}
        />
      )}
    </div>
  );

  async function handleDeletePermanently() {
    console.log('deleting permanently', contentId, contentType);
  }

  async function handleUndoDelete() {
    console.log('undoing deletion', contentId, contentType);
  }
}
