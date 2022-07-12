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
    userLink: { color: userLinkColor, opacity: userLinkOpacity },
    content: { color: contentColor }
  } = useTheme();
  const HeadingText = useMemo(() => {
    const params = {
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
    };
    return SELECTED_LANGUAGE === 'kr'
      ? renderKoreanMessage(params)
      : renderEnglishMessage(params);
  }, [
    action,
    byUser,
    contentColor,
    commentId,
    contentObj,
    contentType,
    id,
    linkColor,
    replyId,
    rootObj,
    rootType,
    targetObj,
    uploader,
    userLinkColor,
    userLinkOpacity
  ]);

  return HeadingText;
}
