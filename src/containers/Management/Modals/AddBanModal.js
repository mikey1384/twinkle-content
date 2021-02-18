import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Table from '../Table';
import RedTimes from '../RedTimes';
import { css } from '@emotion/css';

AddBanModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function AddBanModal({ onHide }) {
  const [banStatus, setBanStatus] = useState({
    all: false,
    chat: false,
    chess: false,
    comment: false
  });
  const [submitDisabled, setSubmitDisabled] = useState(false);

  return (
    <ErrorBoundary>
      <Modal onHide={onHide}>
        <header style={{ display: 'block' }}>Restrict Account</header>
        <main>
          <Table columns="2fr 1fr">
            <thead>
              <tr>
                <th>Features</th>
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
              <tr onClick={() => handleBanStatusClick('all')}>
                <td style={{ fontWeight: 'bold' }}>Log In</td>
                <td style={{ textAlign: 'center' }}>
                  {banStatus.all && <RedTimes />}
                </td>
              </tr>
              <tr onClick={() => handleBanStatusClick('chat')}>
                <td style={{ fontWeight: 'bold' }}>Chat</td>
                <td style={{ textAlign: 'center' }}>
                  {banStatus.chat && <RedTimes />}
                </td>
              </tr>
              <tr onClick={() => handleBanStatusClick('chess')}>
                <td style={{ fontWeight: 'bold' }}>Chess</td>
                <td style={{ textAlign: 'center' }}>
                  {banStatus.chess && <RedTimes />}
                </td>
              </tr>
              <tr onClick={() => handleBanStatusClick('comment')}>
                <td style={{ fontWeight: 'bold' }}>Comment</td>
                <td style={{ textAlign: 'center' }}>
                  {banStatus.comment && <RedTimes />}
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
          <Button color="blue" disabled={submitDisabled} onClick={handleSubmit}>
            Done
          </Button>
        </footer>
      </Modal>
    </ErrorBoundary>
  );

  function handleBanStatusClick(feature) {
    setBanStatus((prevStatus) => ({
      ...prevStatus,
      [feature]: !prevStatus[feature]
    }));
  }

  function handleSubmit() {
    setSubmitDisabled(false);
  }
}
