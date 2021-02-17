import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Modal from 'components/Modal';
import Table from '../Table';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { Color } from 'constants/css';
import { css } from '@emotion/css';

EditBanStatusModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function EditBanStatusModal({ onHide }) {
  return (
    <ErrorBoundary>
      <Modal onHide={onHide}>
        <header style={{ display: 'block' }}>Edit Restriction Status:</header>
        <main>
          <Table columns="2fr 1fr">
            <thead>
              <tr>
                <th>Perks</th>
                <th></th>
              </tr>
            </thead>
            <tbody
              className={`${css`
                tr {
                  cursor: pointer;
                }
              `} unselectable`}
            >
              <tr onClick={() => console.log('clicked')}>
                <td style={{ fontWeight: 'bold' }}>Can Edit</td>
                <td style={{ textAlign: 'center' }}>
                  <Icon icon="times" style={{ color: Color.rose() }} />
                </td>
              </tr>
              <tr onClick={() => console.log('clicked')}>
                <td style={{ fontWeight: 'bold' }}>Can Delete</td>
                <td style={{ textAlign: 'center' }}>
                  <Icon icon="times" style={{ color: Color.rose() }} />
                </td>
              </tr>
              <tr onClick={() => console.log('clicked')}>
                <td style={{ fontWeight: 'bold' }}>Can Reward</td>
                <td style={{ textAlign: 'center' }}>
                  <Icon icon="times" style={{ color: Color.rose() }} />
                </td>
              </tr>
              <tr onClick={() => console.log('clicked')}>
                <td style={{ fontWeight: 'bold' }}>Can Feature Contents</td>
                <td style={{ textAlign: 'center' }}>
                  <Icon icon="times" style={{ color: Color.rose() }} />
                </td>
              </tr>
              <tr onClick={() => console.log('clicked')}>
                <td style={{ fontWeight: 'bold' }}>Can Edit Playlists</td>
                <td style={{ textAlign: 'center' }}>
                  <Icon icon="times" style={{ color: Color.rose() }} />
                </td>
              </tr>
            </tbody>
          </Table>
        </main>
        <footer>
          <Button
            transparent
            onClick={onHide}
            style={{ marginRight: '0.7rem' }}
          >
            Cancel
          </Button>
          <Button
            color="blue"
            disabled={true}
            onClick={() => console.log('clicked')}
          >
            Done
          </Button>
        </footer>
      </Modal>
    </ErrorBoundary>
  );
}
