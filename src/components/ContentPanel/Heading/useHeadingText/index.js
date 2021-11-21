import { useMemo } from 'react';
import { useMyState } from 'helpers/hooks';
import renderEnglishMessage from './localize/english';
import renderKoreanMessage from './localize/korean';

const selectedLanguage = process.env.REACT_APP_SELECTED_LANGUAGE;

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
    const params = {
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
    };
    return selectedLanguage === 'en'
      ? renderEnglishMessage(params)
      : renderKoreanMessage(params);
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
