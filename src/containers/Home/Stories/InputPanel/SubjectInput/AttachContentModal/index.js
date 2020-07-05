import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import StartScreen from './StartScreen';
import SelectAttachmentScreen from './SelectAttachmentScreen';

const sectionObj = {
  start: {
    title: 'Attach a content to your {type}'
  },
  selectVideo: {
    title: 'Select a Video'
  },
  selectLink: {
    title: 'Select a Webpage'
  }
};

AttachContentModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  type: PropTypes.string,
  contentType: PropTypes.string,
  contentId: PropTypes.number
};

export default function AttachContentModal({
  onConfirm,
  onHide,
  type,
  contentType,
  contentId
}) {
  const [section, setSection] = useState('start');
  const [selected, setSelected] = useState();
  return (
    <Modal
      large={section === 'selectVideo' || section === 'selectLink'}
      onHide={onHide}
    >
      <header>{sectionObj[section].title.replace('{type}', type)}</header>
      <main>
        {section === 'start' && (
          <StartScreen
            navigateTo={setSection}
            onHide={onHide}
            type={type}
            contentType={contentType}
            contentId={contentId}
          />
        )}
        {section === 'selectVideo' && (
          <SelectAttachmentScreen
            contentType="video"
            onSelect={(video) =>
              setSelected({
                contentType: 'video',
                id: video.id,
                title: video?.title
              })
            }
            onDeselect={() => setSelected(undefined)}
          />
        )}
        {section === 'selectLink' && (
          <SelectAttachmentScreen
            contentType="url"
            onSelect={(link) =>
              setSelected({
                contentType: 'url',
                id: link.id,
                title: link?.title
              })
            }
            onDeselect={() => setSelected(undefined)}
          />
        )}
      </main>
      <footer>
        <Button
          transparent
          onClick={
            section === 'start'
              ? onHide
              : () => {
                  setSection('start');
                  setSelected(undefined);
                }
          }
        >
          {section === 'start' ? 'Cancel' : 'Back'}
        </Button>
        {section !== 'start' && (
          <Button
            disabled={!selected}
            color="blue"
            style={{ marginLeft: '0.7rem' }}
            onClick={() => onConfirm(selected, 'subject')}
          >
            Confirm
          </Button>
        )}
      </footer>
    </Modal>
  );
}
