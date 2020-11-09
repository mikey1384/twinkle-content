import React from 'react';
import ItemPanel from './ItemPanel';
import Icon from 'components/Icon';
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import { karmaPointTable } from 'constants/defaultValues';

const item = {
  maxLvl: 7,
  name: [
    'Expand upload file size limit',
    'Expand upload file size limit (level 2)',
    'Expand upload file size limit (level 3)',
    'Expand upload file size limit (level 4)',
    'Expand upload file size limit (level 5)',
    'Expand upload file size limit (level 6)',
    'Expand upload file size limit (level 7)'
  ],
  description: [
    'Unlock this item to upload files up to 500 MB in size',
    'Upgrade this item to upload files up to 750 MB in size',
    'Upgrade this item to upload files up to 1 GB in size',
    'Upgrade this item to upload files up to 1.25 GB in size',
    'Upgrade this item to upload files up to 1.5 GB in size',
    'Upgrade this item to upload files up to 1.75 GB in size',
    'Upgrade this item to upload files up to 2 GB in size'
  ]
};

export default function FileSizeItem() {
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
      style={{ marginTop: '5rem' }}
      upgradeIcon={<Icon size="3x" icon="upload" />}
    />
  );

  async function handleUpgrade() {
    const success = await upgradeFileUploadSize();
    if (success) {
      onUpdateProfileInfo({ userId, fileUploadLvl: fileUploadLvl + 1 });
    }
  }
}
