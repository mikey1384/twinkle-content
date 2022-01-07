import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import { css } from '@emotion/css';
import localize from 'constants/localize';

const enterCurrentPasswordLabel = localize('enterCurrentPassword');
const enterNewPasswordLabel = localize('enterNewPassword');

ChangePasswordModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function ChangePasswordModal({ onHide }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsgObj, setErrorMsgObj] = useState({
    currentPassword: '',
    newPassword: ''
  });

  return (
    <Modal closeWhenClickedOutside={false} small onHide={onHide}>
      <header>Change Your Password</header>
      <main>
        <form
          className={css`
            label {
              font-weight: bold;
            }
          `}
          style={{ width: '100%' }}
        >
          <div>
            <label>Current</label>
            <Input
              name="current-password"
              value={currentPassword}
              style={{ marginTop: '0.5rem' }}
              onChange={(text) => {
                setErrorMsgObj((obj) => ({
                  ...obj,
                  currentPassword: ''
                }));
                setCurrentPassword(text);
              }}
              placeholder={enterCurrentPasswordLabel}
              type="password"
              hasError={!!errorMsgObj.currentPassword}
            />
            {errorMsgObj.currentPassword ? (
              <span style={{ color: 'red', marginTop: '0.5rem' }}>
                {errorMsgObj.currentPassword}
              </span>
            ) : null}
          </div>
          <div style={{ marginTop: '2rem' }}>
            <label>New</label>
            <Input
              name="new-password"
              value={newPassword}
              style={{ marginTop: '0.5rem' }}
              onChange={(text) => {
                setErrorMsgObj((obj) => ({
                  ...obj,
                  newPassword: ''
                }));
                setNewPassword(text);
              }}
              placeholder={enterNewPasswordLabel}
              type="password"
              hasError={!!errorMsgObj.newPassword}
            />
            {errorMsgObj.newPassword ? (
              <span style={{ color: 'red', marginTop: '0.5rem' }}>
                {errorMsgObj.newPassword}
              </span>
            ) : null}
          </div>
        </form>
      </main>
      <footer>
        <Button onClick={onHide} transparent>
          Cancel
        </Button>
        <Button
          style={{ marginLeft: '1rem' }}
          color="blue"
          onClick={handleSubmit}
          disabled={true}
        >
          Done
        </Button>
      </footer>
    </Modal>
  );

  async function handleSubmit() {
    console.log('done');
    onHide();
  }
}
