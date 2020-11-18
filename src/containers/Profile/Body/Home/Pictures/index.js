import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import Button from 'components/Button';
import DropdownButton from 'components/Buttons/DropdownButton';
import Carousel from 'components/Carousel';
import Frame from './Frame';
import Icon from 'components/Icon';
import DeleteInterface from './DeleteInterface';
import { useAppContext, useContentContext } from 'contexts';
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
  const {
    actions: { onUpdateProfileInfo }
  } = useContentContext();
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
      const success = await deleteProfilePictures(remainingPictures);
      if (success) {
        onUpdateProfileInfo({ userId: profileId, pictures: remainingPictures });
      }
      setDeleteMode(false);
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
        ) : pictures.length > 2 ? (
          <Carousel
            className={css`
              width: 75%;
            `}
            allowDrag={false}
            slidesToShow={Math.min(pictures.length, 3)}
            slidesToScroll={1}
          >
            {pictures.map((picture, index) => (
              <Frame forCarousel key={index} picture={picture} />
            ))}
          </Carousel>
        ) : (
          <div
            style={{ width: '75%', display: 'flex', justifyContent: 'center' }}
          >
            {pictures.map((picture, index) => (
              <Frame
                key={index}
                picture={picture}
                style={{ marginLeft: index === 0 ? 0 : '1rem' }}
              />
            ))}
          </div>
        )}
      </div>
    </SectionPanel>
  ) : (
    <div>No Pictures</div>
  );
}
