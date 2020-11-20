import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { css } from 'emotion';
import { cloudFrontURL } from 'constants/defaultValues';
import { Color, borderRadius, innerBorderRadius } from 'constants/css';
import { useAppContext } from 'contexts';

ArchivedPicture.propTypes = {
  picture: PropTypes.object.isRequired,
  onDeleteArchivedPicture: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function ArchivedPicture({
  picture,
  style,
  onDeleteArchivedPicture
}) {
  const {
    requestHelpers: { deleteArchivedPicture }
  } = useAppContext();
  const imageUrl = useMemo(() => {
    return picture?.src ? `${cloudFrontURL}${picture?.src}` : '';
  }, [picture]);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const width = 25;

  return (
    <div
      className={css`
        position: relative;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        width: CALC(${width}% - 2rem);
        padding-bottom: CALC(${width}% - 2rem - 2px);
      `}
      style={style}
    >
      <img
        onClick={handleImageSelect}
        style={{
          borderRadius: innerBorderRadius,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center'
        }}
        src={imageUrl}
      />
      <div
        onClick={() => setConfirmModalShown(true)}
        style={{
          cursor: 'pointer',
          position: 'absolute',
          width: 'CALC(2rem + 8px)',
          height: 'CALC(2rem + 8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          top: 3,
          right: 3,
          background: Color.black(),
          borderRadius: '50%'
        }}
      >
        <Icon style={{ color: '#fff', fontSize: '2rem' }} icon="times" />
      </div>
      {confirmModalShown && (
        <ConfirmModal
          modalOverModal
          onHide={() => setConfirmModalShown(false)}
          title="Permanently Delete Picture"
          onConfirm={handleImageDelete}
        />
      )}
    </div>
  );

  function handleImageSelect() {
    console.log('image clicked');
  }

  async function handleImageDelete() {
    await deleteArchivedPicture(picture.id);
    onDeleteArchivedPicture(picture.id);
  }
}
