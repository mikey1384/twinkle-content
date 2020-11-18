import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import Button from 'components/Button';
import DropdownButton from 'components/Buttons/DropdownButton';
import Carousel from 'components/Carousel';
import Frame from './Frame';
import Icon from 'components/Icon';
import DeleteInterface from './DeleteInterface';
import { useAppContext } from 'contexts';
import { css } from 'emotion';
import { useMyState } from 'helpers/hooks';

Pictures.propTypes = {
  numFrames: PropTypes.number,
  pictures: PropTypes.array,
  profileId: PropTypes.number,
  selectedTheme: PropTypes.string
};

export default function Pictures({
  numFrames,
  profileId,
  pictures,
  selectedTheme
}) {
  const { userId } = useMyState();
  const [deleteMode, setDeleteMode] = useState(false);
  const [remainingPictures, setRemainingPictures] = useState(pictures);
  const {
    requestHelpers: { deleteProfilePictures }
  } = useAppContext();
  const menuButtons = useMemo(() => {
    if (userId !== profileId) return null;
    return deleteMode ? (
      <div style={{ display: 'flex' }}>
        <Button
          color="vantaBlack"
          transparent
          onClick={handlePictureDeleteCancel}
        >
          Cancel
        </Button>
        <Button
          skeuomorphic
          style={{ marginLeft: '1rem' }}
          onClick={handlePictureDeleteConfirm}
        >
          Save
        </Button>
      </div>
    ) : (
      <div style={{ display: 'flex' }}>
        <Button
          color="darkerGray"
          skeuomorphic
          onClick={() => console.log('clicked')}
        >
          <Icon icon="plus" />
          <span style={{ marginLeft: '0.7rem' }}>
            Add Picture ({pictures.length}/{numFrames})
          </span>
        </Button>
        <DropdownButton
          skeuomorphic
          icon="ellipsis-h"
          color="darkerGray"
          direction="left"
          style={{ marginLeft: '1rem' }}
          menuProps={[
            {
              label: (
                <>
                  <Icon icon="sort" />
                  <span style={{ marginLeft: '1rem' }}>Reorder</span>
                </>
              ),
              onClick: () => console.log('edit')
            },
            {
              label: (
                <>
                  <Icon icon="trash-alt" />
                  <span style={{ marginLeft: '1rem' }}>Delete</span>
                </>
              ),
              onClick: () => setDeleteMode(true)
            }
          ]}
        />
      </div>
    );
    function handlePictureDeleteCancel() {
      setDeleteMode(false);
      setRemainingPictures(pictures);
    }
    async function handlePictureDeleteConfirm() {
      await deleteProfilePictures(remainingPictures);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteMode, numFrames, pictures, remainingPictures]);

  return pictures ? (
    <SectionPanel
      button={menuButtons}
      customColorTheme={selectedTheme}
      loaded
      title={deleteMode ? 'Delete pictures' : 'Pictures'}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '-1rem'
        }}
      >
        {deleteMode ? (
          <DeleteInterface
            remainingPictures={remainingPictures}
            pictures={pictures}
            onSetRemainingPictures={setRemainingPictures}
          />
        ) : (
          <Carousel
            className={css`
              width: ${pictures.length > 2
                ? '75%'
                : pictures.length > 1
                ? '50%'
                : '25%'};
            `}
            allowDrag={false}
            slidesToShow={Math.min(pictures.length, 3)}
            slidesToScroll={1}
          >
            {pictures.map((picture, index) => (
              <Frame key={index} picture={picture} />
            ))}
          </Carousel>
        )}
      </div>
    </SectionPanel>
  ) : (
    <div>No Pictures</div>
  );
}
