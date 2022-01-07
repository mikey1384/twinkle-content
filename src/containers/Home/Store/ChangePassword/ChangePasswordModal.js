import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import { css } from '@emotion/css';
import { isValidPassword, stringIsEmpty } from 'helpers/stringHelpers';
import localize from 'constants/localize';

const enterCurrentPasswordLabel = localize('enterCurrentPassword');
const enterNewPasswordLabel = localize('enterNewPassword');
const newPasswordMatchesCurrentPasswordLabel = localize(
  'newPasswordMatchesCurrentPassword'
);
const passwordsNeedToBeAtLeastLabel = localize('passwordsNeedToBeAtLeast');
const retypeNewPasswordLabel = localize('retypeNewPassword');
const retypePasswordDoesNotMatchLabel = localize('retypePasswordDoesNotMatch');

ChangePasswordModal.propTypes = {
  onHide: PropTypes.func.isRequired
};

export default function ChangePasswordModal({ onHide }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');
  const [errorMsgObj, setErrorMsgObj] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const newPasswordTimerRef = useRef(null);
  const retypeNewPasswordTimerRef = useRef(null);
  const passwordIsValid = useMemo(() => {
    return isValidPassword(newPassword);
  }, [newPassword]);
  const newPasswordIsTheSameAsTheCurrentOne = useMemo(() => {
    if (stringIsEmpty(newPassword) || stringIsEmpty(currentPassword)) {
      return false;
    }
    return newPassword === currentPassword;
  }, [currentPassword, newPassword]);
  const retypePasswordMatches = useMemo(() => {
    if (stringIsEmpty(newPassword) || stringIsEmpty(retypeNewPassword)) {
      return false;
    }
    return newPassword === retypeNewPassword;
  }, [newPassword, retypeNewPassword]);

  const submitDisabled = useMemo(() => {
    return (
      stringIsEmpty(currentPassword) ||
      !retypePasswordMatches ||
      newPasswordIsTheSameAsTheCurrentOne
    );
  }, [
    currentPassword,
    newPasswordIsTheSameAsTheCurrentOne,
    retypePasswordMatches
  ]);

  useEffect(() => {
    clearTimeout(newPasswordTimerRef.current);
    newPasswordTimerRef.current = setTimeout(() => {
      if (!stringIsEmpty(newPassword) && !passwordIsValid) {
        return setErrorMsgObj((obj) => ({
          ...obj,
          newPassword: passwordsNeedToBeAtLeastLabel
        }));
      }
    }, 500);
  }, [newPassword, passwordIsValid]);

  useEffect(() => {
    if (newPasswordIsTheSameAsTheCurrentOne) {
      return setErrorMsgObj((obj) => ({
        ...obj,
        newPassword: newPasswordMatchesCurrentPasswordLabel
      }));
    }
  }, [newPasswordIsTheSameAsTheCurrentOne]);

  useEffect(() => {
    clearTimeout(retypeNewPasswordTimerRef.current);
    retypeNewPasswordTimerRef.current = setTimeout(() => {
      if (!stringIsEmpty(retypeNewPassword) && !retypePasswordMatches) {
        return setErrorMsgObj((obj) => ({
          ...obj,
          retypeNewPassword: retypePasswordDoesNotMatchLabel
        }));
      }
    }, 500);
  }, [retypeNewPassword, retypePasswordMatches]);

  return (
    <Modal closeWhenClickedOutside={false} small onHide={onHide}>
      <header>Change Your Password</header>
      <main>
        <form
          className={css`
            label {
              font-weight: bold;
            }
            span {
              font-size: 1.3rem;
            }
          `}
          style={{ width: '100%' }}
        >
          <div>
            <label>Current Password</label>
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
            <label>New Password</label>
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
          {passwordIsValid && (
            <div style={{ marginTop: '1.5rem' }}>
              <label>Retype New Password</label>
              <Input
                name="retype-new-password"
                value={retypeNewPassword}
                style={{ marginTop: '0.5rem' }}
                onChange={(text) => {
                  setErrorMsgObj((obj) => ({
                    ...obj,
                    retypeNewPassword: ''
                  }));
                  setRetypeNewPassword(text);
                }}
                placeholder={retypeNewPasswordLabel}
                type="password"
                hasError={!!errorMsgObj.retypeNewPassword}
              />
              {errorMsgObj.retypeNewPassword ? (
                <span style={{ color: 'red', marginTop: '0.5rem' }}>
                  {errorMsgObj.retypeNewPassword}
                </span>
              ) : null}
            </div>
          )}
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
          disabled={submitDisabled}
        >
          Change
        </Button>
      </footer>
    </Modal>
  );

  async function handleSubmit() {
    console.log('done');
    onHide();
  }
}
