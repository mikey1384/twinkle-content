import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import Button from 'components/Button';
import DropdownButton from 'components/Buttons/DropdownButton';
import Carousel from 'components/Carousel';
import Frame from './Frame';
import Icon from 'components/Icon';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import DeleteInterface from './DeleteInterface';

Pictures.propTypes = {
  numFrames: PropTypes.number,
  pictures: PropTypes.array,
  selectedTheme: PropTypes.string
};

export default function Pictures({ numFrames, pictures, selectedTheme }) {
  const [deleteMode, setDeleteMode] = useState(false);
  const [remainingPictures, setRemainingPictures] = useState(pictures);
  return pictures ? (
    <SectionPanel
      button={
        deleteMode ? (
          <div style={{ display: 'flex' }}>
            <Button
              color="vantaBlack"
              transparent
              onClick={() => setDeleteMode(false)}
            >
              Cancel
            </Button>
            <Button skeuomorphic style={{ marginLeft: '1rem' }}>
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
        )
      }
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
              width: 80%;
              @media (max-width: ${mobileMaxWidth}) {
                width: 100%;
              }
            `}
            allowDrag={false}
            slidesToShow={3}
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
