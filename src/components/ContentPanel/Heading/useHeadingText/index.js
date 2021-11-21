import { useMemo } from 'react';
import { useMyState } from 'helpers/hooks';
import renderEnglishMessage from './localize/english';

export default function useHeadingText({ action, contentObj }) {
  const {
    byUser,
    commentId,
    id,
    targetObj = {},
    replyId,
    rootType,
    contentType,
    uploader,
    rootObj
  } = contentObj;
  const { profileTheme } = useMyState();
  const HeadingText = useMemo(() => {
    return renderEnglishMessage({
      action,
      byUser,
      commentId,
      contentObj,
      contentType,
      id,
      profileTheme,
      replyId,
      rootObj,
      rootType,
      targetObj,
      uploader
    });
  }, [
    action,
    byUser,
    commentId,
    contentObj,
    contentType,
    id,
    profileTheme,
    replyId,
    rootObj,
    rootType,
    targetObj,
    uploader
  ]);

  return HeadingText;
}
