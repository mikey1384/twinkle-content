import React from 'react';
import { Color } from 'constants/css';
import UsernameText from 'components/Texts/UsernameText';
import ContentLink from 'components/ContentLink';
import localize from 'constants/localize';

export default function renderKoreanMessage({
  id,
  action,
  byUser,
  commentId,
  contentObj,
  contentType,
  profileTheme,
  replyId,
  rootObj,
  rootType,
  targetObj,
  uploader
}) {
  const contentLabel =
    rootType === 'url' ? 'link' : rootType === 'subject' ? 'subject' : rootType;
  switch (contentType) {
    case 'video':
      return (
        <>
          <UsernameText user={uploader} color={Color.blue()} />
          님이 동영상을 게시했습니다:{' '}
          <ContentLink content={contentObj} contentType={contentType} />{' '}
        </>
      );
    case 'comment':
      return (
        <>
          <UsernameText user={uploader} color={Color.blue()} />
          님이 <ContentLink content={rootObj} contentType={rootType} />(
          {localize(contentLabel)})에 {renderTargetAction()}
          <ContentLink
            content={{ id, title: action }}
            contentType={contentType}
            style={{ color: Color.green() }}
          />{' '}
        </>
      );
    case 'url':
      return (
        <>
          <UsernameText user={uploader} color={Color.blue()} /> shared a
          link:&nbsp;
          <ContentLink content={contentObj} contentType={contentType} />{' '}
        </>
      );
    case 'subject':
      return (
        <>
          <UsernameText user={uploader} color={Color.blue()} /> started a{' '}
          <ContentLink
            content={{ id, title: 'subject ' }}
            contentType={contentType}
            style={{ color: byUser ? Color[profileTheme]() : Color.green() }}
          />
          {rootObj.id && (
            <>
              on {contentLabel}:{' '}
              <ContentLink content={rootObj} contentType={rootType} />{' '}
            </>
          )}
        </>
      );
    case 'pass':
      return (
        <>
          <UsernameText user={uploader} color={Color.blue()} /> completed a{' '}
          <ContentLink
            content={{
              id: rootObj.id,
              title: `${rootObj.isTask ? 'task' : 'mission'}: ${rootObj.title}`,
              missionType: rootObj.missionType,
              rootMissionType: rootObj.rootMission?.missionType
            }}
            contentType="mission"
            style={{ color: Color.orange() }}
          />{' '}
        </>
      );
    default:
      return <span>Error</span>;
  }

  function renderTargetAction() {
    if (targetObj?.comment && !targetObj?.comment.notFound) {
      return (
        <span>
          <UsernameText
            user={targetObj.comment.uploader}
            color={Color.blue()}
          />
          님이 남기신{' '}
          <ContentLink
            content={{
              id: replyId || commentId,
              title: replyId
                ? localize('reply')
                : rootType === 'user'
                ? localize('message')
                : localize('comment')
            }}
            contentType="comment"
            style={{ color: Color.green() }}
          />
          에{' '}
        </span>
      );
    }
    return null;
  }
}
