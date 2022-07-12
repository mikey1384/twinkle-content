import React from 'react';
import { Color } from 'constants/css';
import UsernameText from 'components/Texts/UsernameText';
import ContentLink from 'components/ContentLink';

export default function renderEnglishMessage({
  id,
  action,
  byUser,
  contentColor,
  commentId,
  contentObj,
  contentType,
  linkColor,
  replyId,
  rootObj,
  rootType,
  targetObj,
  uploader,
  userLinkColor,
  userLinkOpacity
}) {
  const contentLabel =
    rootType === 'url' ? 'link' : rootType === 'subject' ? 'subject' : rootType;
  const contentLinkColor = Color[contentColor]();

  switch (contentType) {
    case 'video':
      return (
        <>
          <UsernameText user={uploader} color={Color[linkColor]()} /> uploaded a
          video: <ContentLink content={contentObj} contentType={contentType} />{' '}
        </>
      );
    case 'comment':
      return (
        <>
          <UsernameText user={uploader} color={Color[linkColor]()} />{' '}
          <ContentLink
            content={{ id, title: action }}
            contentType={contentType}
            style={{ color: contentLinkColor }}
          />
          {renderTargetAction()} {contentLabel}:{' '}
          <ContentLink content={rootObj} contentType={rootType} />{' '}
        </>
      );
    case 'url':
      return (
        <>
          <UsernameText user={uploader} color={Color[linkColor]()} /> shared a
          link:&nbsp;
          <ContentLink content={contentObj} contentType={contentType} />{' '}
        </>
      );
    case 'subject':
      return (
        <>
          <UsernameText user={uploader} color={Color[linkColor]()} /> started a{' '}
          <ContentLink
            content={{ id, title: 'subject ' }}
            contentType={contentType}
            style={{
              color: byUser
                ? Color[userLinkColor](userLinkOpacity)
                : contentLinkColor
            }}
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
          <UsernameText user={uploader} color={Color[linkColor]()} /> completed
          a{' '}
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
          {' '}
          <UsernameText
            user={targetObj.comment.uploader}
            color={Color[linkColor]()}
          />
          {"'s "}
          <ContentLink
            content={{
              id: replyId || commentId,
              title: replyId
                ? 'reply '
                : rootType === 'user'
                ? 'message '
                : 'comment '
            }}
            contentType="comment"
            style={{ color: contentLinkColor }}
          />
          {!replyId && rootType === 'user' ? 'to' : 'on'}
        </span>
      );
    }
    return null;
  }
}
