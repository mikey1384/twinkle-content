import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import ConfirmModal from 'components/Modals/ConfirmModal';
import { css } from '@emotion/css';
import { cloudFrontURL } from 'constants/defaultValues';
import { Color, Theme, borderRadius, innerBorderRadius } from 'constants/css';
import { useAppContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

ArchivedPicture.propTypes = {
  picture: PropTypes.object.isRequired,
  selectedPictureIds: PropTypes.array.isRequired,
  onDeleteArchivedPicture: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  style: PropTypes.object
};

const width = 25;

export default function ArchivedPicture({
  onSelect,
  picture,
  selectedPictureIds,
  style,
  onDeleteArchivedPicture
}) {
  const { profileTheme } = useMyState();
  const deleteArchivedPicture = useAppContext(
    (v) => v.requestHelpers.deleteArchivedPicture
  );
  const imageUrl = useMemo(() => {
    return picture?.src ? `${cloudFrontURL}${picture?.src}` : '';
  }, [picture]);
  const [confirmModalShown, setConfirmModalShown] = useState(false);
  const isSelected = useMemo(
    () => selectedPictureIds.includes(picture.id),
    [picture.id, selectedPictureIds]
  );
  const selectedItemColor = useMemo(
    () =>
      Color[Theme(profileTheme).itemSelected.color](
        Theme(profileTheme).itemSelected.opacity
      ),
    [profileTheme]
  );

  return (
    <div
      className={css`
        background: #fff;
        position: relative;
        width: CALC(${width}% - 2rem);
        padding-bottom: CALC(${width}% - 2rem - 2px);
      `}
      style={{
        ...style,
        borderRadius,
        boxShadow: isSelected ? `0 0 5px ${selectedItemColor}` : '',
        border: isSelected
          ? `5px solid ${selectedItemColor}`
          : `1px solid ${Color.borderGray()}`
      }}
    >
      <img
        onClick={() => onSelect(picture.id)}
        style={{
          borderRadius: isSelected ? 0 : innerBorderRadius,
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center'
        }}
        src={imageUrl}
      />
      {!isSelected && (
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
      )}
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

  async function handleImageDelete() {
    await deleteArchivedPicture(picture.id);
    onDeleteArchivedPicture(picture.id);
  }
}
