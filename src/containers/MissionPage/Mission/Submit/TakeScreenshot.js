import React, { useRef, useMemo, useState } from 'react';
import Button from 'components/Button';
import AlertModal from 'components/Modals/AlertModal';
import { mb } from 'constants/defaultValues';
import { useMyState } from 'helpers/hooks';
import { getFileInfoFromFileName } from 'helpers/stringHelpers';

export default function TakeScreenshot() {
  const { authLevel } = useMyState();
  const [alertModalShown, setAlertModalShown] = useState(false);
  const FileInputRef = useRef(null);
  const maxSize = useMemo(
    () =>
      authLevel > 3
        ? 5000 * mb
        : authLevel > 1
        ? 3000 * mb
        : authLevel === 1
        ? 1000 * mb
        : 300 * mb,
    [authLevel]
  );

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}
    >
      <Button
        color="darkBlue"
        skeuomorphic
        style={{ fontSize: '2rem' }}
        onClick={() => FileInputRef.current.click()}
      >
        Submit Screenshot
      </Button>
      <input
        ref={FileInputRef}
        style={{ display: 'none' }}
        type="image"
        onChange={handleFileSelection}
      />
      {alertModalShown && (
        <AlertModal
          title="File is too large"
          content={`The file size is larger than your limit of ${
            maxSize / mb
          } MB`}
          onHide={() => setAlertModalShown(false)}
        />
      )}
    </div>
  );

  function handleFileSelection(event) {
    const fileObj = event.target.files[0];
    if (fileObj.size / mb > maxSize) {
      return setAlertModalShown(true);
    }
    const { fileType } = getFileInfoFromFileName(fileObj.name);
    if (fileType === 'image') {
      const reader = new FileReader();
      reader.onload = (upload) => {
        const payload = upload.target.result;
        window.loadImage(
          payload,
          function (img) {
            const imageUri = img.toDataURL('image/jpeg');
            const dataUri = imageUri.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(dataUri, 'base64');
            const file = new File([buffer], fileObj.name);
            console.log(fileType, file, imageUri);
          },
          { orientation: true, canvas: true }
        );
      };
      reader.readAsDataURL(fileObj);
    } else {
      // return error
    }
    event.target.value = null;
  }
}
