import React from 'react';
import PropTypes from 'prop-types';
import Embedly from 'components/Embedly';
import LongText from 'components/Texts/LongText';
import XPVideoPlayer from 'components/XPVideoPlayer';
import ContentEditor from './ContentEditor';
import ErrorBoundary from 'components/ErrorBoundary';
import ContentFileViewer from 'components/ContentFileViewer';
import LoginToViewContent from 'components/LoginToViewContent';
import RewardLevelBar from 'components/RewardLevelBar';
import AlreadyPosted from 'components/AlreadyPosted';
import TagStatus from 'components/TagStatus';
import SecretAnswer from 'components/SecretAnswer';
import Link from 'components/Link';
import SecretComment from 'components/SecretComment';
import MissionContent from './MissionContent';
import { stringIsEmpty, getFileInfoFromFileName } from 'helpers/stringHelpers';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { useContentState } from 'helpers/hooks';
import { useAppContext, useContentContext } from 'contexts';
import { useHistory } from 'react-router-dom';

MainContent.propTypes = {
  contentId: PropTypes.number.isRequired,
  contentType: PropTypes.string.isRequired,
  onClickSecretAnswer: PropTypes.func.isRequired,
  secretHidden: PropTypes.bool,
  userId: PropTypes.number
};

export default function MainContent({
  contentId,
  contentType,
  onClickSecretAnswer,
  secretHidden,
  userId
}) {
  const history = useHistory();
  const {
    requestHelpers: { editContent }
  } = useAppContext();
  const {
    byUser,
    content,
    description,
    fileName,
    filePath,
    fileSize,
    thumbUrl,
    isEditing,
    isNotification,
    rootContent,
    rootObj,
    uploader,
    rewardLevel,
    rootId,
    rootType,
    secretAnswer,
    secretAttachment,
    targetObj,
    tags,
    title
  } = useContentState({ contentId, contentType });
  const {
    actions: {
      onAddTags,
      onAddTagToContents,
      onEditContent,
      onLoadTags,
      onSetIsEditing
    }
  } = useContentContext();
  const { fileType } = fileName ? getFileInfoFromFileName(fileName) : '';

  return (
    <ErrorBoundary>
      <div>
        {contentType === 'pass' && (
          <MissionContent uploader={uploader} rootObj={rootObj} />
        )}
        {(contentType === 'subject' || contentType === 'comment') &&
          filePath &&
          !(contentType === 'comment' && secretHidden) &&
          (userId ? (
            <ContentFileViewer
              contentId={contentId}
              contentType={contentType}
              fileName={fileName}
              filePath={filePath}
              fileSize={fileSize}
              thumbUrl={thumbUrl}
              videoHeight="100%"
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: byUser ? '1.7rem' : '1rem',
                ...(fileType === 'audio'
                  ? {
                      padding: '1rem'
                    }
                  : {}),
                marginBottom: rewardLevel ? '1.5rem' : 0
              }}
            />
          ) : (
            <LoginToViewContent />
          ))}
        {(contentType === 'video' ||
          (contentType === 'subject' && rootType === 'video' && rootObj)) && (
          <XPVideoPlayer
            stretch
            rewardLevel={
              contentType === 'subject' ? rootObj.rewardLevel : rewardLevel
            }
            byUser={!!(rootObj.byUser || byUser)}
            onEdit={isEditing}
            title={rootObj.title || title}
            uploader={rootObj.uploader || uploader}
            videoId={contentType === 'video' ? contentId : rootId}
            videoCode={contentType === 'video' ? content : rootObj.content}
            style={{ paddingBottom: '0.5rem' }}
          />
        )}
        {contentType === 'subject' && !rootObj.id && !!rewardLevel && (
          <RewardLevelBar
            className={css`
              margin-left: -1px;
              margin-right: -1px;
              @media (max-width: ${mobileMaxWidth}) {
                margin-left: 0px;
                margin-right: 0px;
              }
            `}
            style={{
              marginBottom: rootType === 'url' ? '-0.5rem' : 0
            }}
            rewardLevel={rewardLevel}
          />
        )}
        {contentType === 'video' && (
          <AlreadyPosted
            style={{ marginTop: '-0.5rem' }}
            uploaderId={(uploader || {}).id}
            contentId={contentId}
            contentType={contentType}
            url={content}
            videoCode={contentType === 'video' ? content : undefined}
          />
        )}
        {contentType === 'video' && (
          <TagStatus
            onAddTags={onAddTags}
            onAddTagToContents={onAddTagToContents}
            onLoadTags={onLoadTags}
            tags={tags || []}
            contentId={contentId}
          />
        )}
        <div
          style={{
            marginTop:
              contentType === 'subject' && filePath ? '0.5rem' : '1rem',
            marginBottom: isEditing
              ? 0
              : contentType !== 'video' && !secretHidden && '1rem',
            padding: '1rem',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordBrea: 'break-word'
          }}
        >
          {!isEditing && (
            <>
              {contentType === 'comment' &&
                (secretHidden ? (
                  <SecretComment
                    onClick={() =>
                      history.push(
                        `/subjects/${targetObj?.subject?.id || rootId}`
                      )
                    }
                  />
                ) : isNotification ? (
                  <div
                    style={{
                      color: Color.gray(),
                      fontWeight: 'bold',
                      borderRadius
                    }}
                  >
                    {uploader.username} viewed the secret message
                  </div>
                ) : (
                  <div
                    style={{
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word'
                    }}
                  >
                    <LongText
                      contentId={contentId}
                      contentType={contentType}
                      section="content"
                    >
                      {content}
                    </LongText>
                  </div>
                ))}
              {contentType === 'subject' && (
                <div
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}
                >
                  <Link
                    style={{
                      fontWeight: 'bold',
                      fontSize: '2.2rem',
                      color: Color.green(),
                      textDecoration: 'none'
                    }}
                    to={`/subjects/${contentId}`}
                  >
                    Subject:
                  </Link>
                  <p
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      fontWeight: 'bold',
                      fontSize: '2.2rem'
                    }}
                  >
                    {title}
                  </p>
                </div>
              )}
              {contentType !== 'comment' && (
                <div
                  style={{
                    marginTop: contentType === 'url' ? '-1rem' : 0,
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    marginBottom:
                      contentType === 'url' || contentType === 'subject'
                        ? '1rem'
                        : '0.5rem'
                  }}
                >
                  <LongText
                    contentId={contentId}
                    contentType={contentType}
                    section="description"
                  >
                    {!stringIsEmpty(description)
                      ? description
                      : contentType === 'video' || contentType === 'url'
                      ? title
                      : ''}
                  </LongText>
                </div>
              )}
              {(secretAnswer || secretAttachment) && (
                <SecretAnswer
                  answer={secretAnswer}
                  attachment={secretAttachment}
                  onClick={onClickSecretAnswer}
                  subjectId={contentId}
                  uploaderId={uploader.id}
                />
              )}
            </>
          )}
          {isEditing && (
            <ContentEditor
              comment={content}
              content={content || rootContent}
              contentId={contentId}
              description={description}
              filePath={filePath}
              onDismiss={() =>
                onSetIsEditing({ contentId, contentType, isEditing: false })
              }
              onEditContent={handleEditContent}
              secretAnswer={secretAnswer}
              style={{
                marginTop:
                  (contentType === 'video' || contentType === 'subject') &&
                  '1rem'
              }}
              title={title}
              contentType={contentType}
            />
          )}
        </div>
        {!isEditing && contentType === 'url' && (
          <Embedly
            contentId={contentId}
            loadingHeight="30rem"
            mobileLoadingHeight="25rem"
          />
        )}
        {contentType === 'subject' && !!rewardLevel && !!rootObj.id && (
          <RewardLevelBar
            className={css`
              margin-left: -1px;
              margin-right: -1px;
              @media (max-width: ${mobileMaxWidth}) {
                margin-left: 0px;
                margin-right: 0px;
              }
            `}
            style={{
              marginBottom: isEditing
                ? '1rem'
                : rootType === 'url' && !secretHidden
                ? '-0.5rem'
                : 0
            }}
            rewardLevel={rewardLevel}
          />
        )}
      </div>
    </ErrorBoundary>
  );

  async function handleEditContent(params) {
    const data = await editContent(params);
    onEditContent({ data, contentType, contentId });
  }
}
