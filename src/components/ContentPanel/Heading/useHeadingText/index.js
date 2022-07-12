import { useMemo } from 'react';
import { useTheme } from 'helpers/hooks';
import { SELECTED_LANGUAGE } from 'constants/defaultValues';
import renderEnglishMessage from './localization/english';
import renderKoreanMessage from './localization/korean';

export default function useHeadingText({ action, contentObj }) {
  const {
    id,
    byUser,
    commentId,
    targetObj = {},
    replyId,
    rootType,
    contentType,
    uploader,
    rootObj
  } = contentObj;
  const {
    link: { color: linkColor },
    subject: { color: subjectColor },
    userLink: { color: userLinkColor, opacity: userLinkOpacity },
    comment: { color: commentColor }
  } = useTheme();
  const HeadingText = useMemo(() => {
    const params = {
      id,
      action,
      byUser,
      commentColor,
      commentId,
      contentObj,
      contentType,
      linkColor,
      replyId,
      rootObj,
      rootType,
      subjectColor,
      targetObj,
      uploader,
      userLinkColor,
      userLinkOpacity
    };
    return SELECTED_LANGUAGE === 'kr'
      ? renderKoreanMessage(params)
      : renderEnglishMessage(params);
  }, [
    action,
    byUser,
    commentColor,
    commentId,
    contentObj,
    contentType,
    id,
    linkColor,
    replyId,
    rootObj,
    rootType,
    subjectColor,
    targetObj,
    uploader,
    userLinkColor,
    userLinkOpacity
  ]);

  return HeadingText;
}
