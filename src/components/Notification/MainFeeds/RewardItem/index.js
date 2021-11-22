import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import renderEnglishText from './localization/english';
import renderKoreanText from './localization/korean';
import { timeSince } from 'helpers/timeStampHelpers';
import { notiFeedListItem } from '../../Styles';

const selectedLanguage = process.env.REACT_APP_SELECTED_LANGUAGE;

RewardItem.propTypes = {
  reward: PropTypes.object.isRequired
};

export default function RewardItem({
  reward: {
    id,
    isTask,
    contentId,
    contentType,
    rootId,
    rootType,
    rootMissionType,
    rewardAmount,
    rewardType,
    rewarderId,
    rewarderUsername,
    targetObj,
    timeStamp
  }
}) {
  const NotiText = useMemo(() => {
    const params = {
      contentId,
      contentType,
      isTask,
      rewardAmount,
      rewardType,
      rewarderId,
      rewarderUsername,
      rootId,
      rootMissionType,
      rootType,
      targetObj
    };
    return selectedLanguage === 'en'
      ? renderEnglishText(params)
      : renderKoreanText(params);
  }, [
    contentId,
    contentType,
    isTask,
    rewardAmount,
    rewardType,
    rewarderId,
    rewarderUsername,
    rootId,
    rootMissionType,
    rootType,
    targetObj
  ]);

  return (
    <nav style={{ background: '#fff' }} className={notiFeedListItem} key={id}>
      {NotiText}
      <small>{timeSince(timeStamp)}</small>
    </nav>
  );
}
