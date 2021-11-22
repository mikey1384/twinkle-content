import { useMemo } from 'react';
import { useMyState } from 'helpers/hooks';
import renderEnglishMessage from './localization/english';
import renderKoreanMessage from './localization/korean';

const selectedLanguage = process.env.REACT_APP_SELECTED_LANGUAGE;

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
  const { profileTheme } = useMyState();
  const HeadingText = useMemo(() => {
    const params = {
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
