import React from 'react';
import PropTypes from 'prop-types';
import ItemPanel from './ItemPanel';
import Icon from 'components/Icon';
import MaxLevelItemInfo from './MaxLevelItemInfo';
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import {
  translateMBToGB,
  translateMBToGBWithoutSpace
} from 'helpers/stringHelpers';
import { karmaPointTable, maxSizes } from 'constants/defaultValues';
import localize from 'constants/localize';

const selectedLanguage = process.env.REACT_APP_SELECTED_LANGUAGE;
const expandMaximumUploadSizeLabel = localize('expandMaximumUploadSize');

const item = {
  maxLvl: 7,
  name: [
    expandMaximumUploadSizeLabel,
    `${expandMaximumUploadSizeLabel} (level 2)`,
    `${expandMaximumUploadSizeLabel} (level 3)`,
    `${expandMaximumUploadSizeLabel} (level 4)`,
    `${expandMaximumUploadSizeLabel} (level 5)`,
    `${expandMaximumUploadSizeLabel} (level 6)`,
    `${expandMaximumUploadSizeLabel} (level 7)`
  ],
  description: maxSizes.map((currentSize, index) => {
    if (index === 0) {
      if (selectedLanguage === 'en') {
        return `Unlock this item to expand your maximum upload file size to ${translateMBToGB(
          maxSizes[1]
        )} (from ${translateMBToGB(currentSize)})`;
      }
      return `본 아이템을 잠금 해제 하시면 파일 업로드 용량 최대치를 ${translateMBToGBWithoutSpace(
        maxSizes[1]
      )}까지 확장하실 수 있습니다 (현재 ${translateMBToGBWithoutSpace(
        currentSize
      )})`;
    }
    if (selectedLanguage === 'en') {
      return `Upgrade this item to expand your maximum upload file size to ${translateMBToGB(
        maxSizes[index + 1]
      )} (from ${translateMBToGB(currentSize)})`;
    }
    return `본 아이템을 업그레이드 하시면 파일 업로드 용량 최대치를 ${translateMBToGBWithoutSpace(
      maxSizes[index + 1]
    )}까지 확장하실 수 있습니다 (현재 ${translateMBToGBWithoutSpace(
      currentSize
    )})`;
  })
};

FileSizeItem.propTypes = {
  style: PropTypes.object
};

export default function FileSizeItem({ style }) {
  const { fileUploadLvl = 0, karmaPoints, userId } = useMyState();
  const {
    actions: { onUpdateProfileInfo }
  } = useContentContext();
  const {
    requestHelpers: { upgradeFileUploadSize }
  } = useAppContext();
  return (
    <ItemPanel
      isLeveled
      currentLvl={fileUploadLvl}
      maxLvl={item.maxLvl}
      karmaPoints={karmaPoints}
      requiredKarmaPoints={karmaPointTable.file[fileUploadLvl]}
      locked={!fileUploadLvl}
      onUnlock={handleUpgrade}
      itemName={item.name[fileUploadLvl]}
      itemDescription={item.description[fileUploadLvl]}
      style={style}
      upgradeIcon={<Icon size="3x" icon="upload" />}
    >
      <MaxLevelItemInfo
        icon="upload"
        title="Maximum upload file size - Level 7"
        description={`You can now upload files up to ${translateMBToGB(
          maxSizes[maxSizes.length - 1]
        )} in size`}
      />
    </ItemPanel>
  );

  async function handleUpgrade() {
    const success = await upgradeFileUploadSize();
    if (success) {
      onUpdateProfileInfo({ userId, fileUploadLvl: fileUploadLvl + 1 });
    }
  }
}
