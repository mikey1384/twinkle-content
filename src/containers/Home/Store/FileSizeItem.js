import React from 'react';
import ItemPanel from './ItemPanel';
import { useMyState } from 'helpers/hooks';
import { karmaPointTable } from 'constants/defaultValues';

export default function FileSizeItem() {
  const { fileUploadLvl = 0, karmaPoints } = useMyState();
  return (
    <ItemPanel
      isLeveled
      currentLvl={fileUploadLvl}
      maxLvl={7}
      karmaPoints={karmaPoints}
      requiredKarmaPoints={karmaPointTable.file[fileUploadLvl]}
      locked={!fileUploadLvl}
      onUnlock={() => console.log('unlocking')}
      itemName={
        [
          'Expand upload file size limit',
          'Expand upload file size limit (level 2)',
          'Expand upload file size limit (level 3)',
          'Expand upload file size limit (level 4)',
          'Expand upload file size limit (level 5)',
          'Expand upload file size limit (level 6)',
          'Expand upload file size limit (level 7)'
        ][fileUploadLvl]
      }
      itemDescription={
        [
          'Unlock this item to upload files up to 500 MB in size',
          'Upgrade this item to upload files up to 750 MB in size',
          'Upgrade this item to upload files up to 1 GB in size',
          'Upgrade this item to upload files up to 1.25 GB in size',
          'Upgrade this item to upload files up to 1.5 GB in size',
          'Upgrade this item to upload files up to 1.75 GB in size',
          'Upgrade this item to upload files up to 2 GB in size'
        ][fileUploadLvl]
      }
      style={{ marginTop: '5rem' }}
    />
  );
}
