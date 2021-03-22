import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import ErrorBoundary from 'components/ErrorBoundary';
import Input from 'components/Texts/Input';
import Banner from 'components/Banner';
import { mobileMaxWidth } from 'constants/css';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useAppContext, useContentContext } from 'contexts';
import { css } from '@emotion/css';

LoginForm.propTypes = {
  username: PropTypes.string,
  onSetUsername: PropTypes.func.isRequired,
  onShowForgotPasswordForm: PropTypes.func,
  onShowSignupForm: PropTypes.func
};

export default function LoginForm({
  username,
  onSetUsername,
  onShowForgotPasswordForm,
  onShowSignupForm
}) {
  const {
    user: {
      actions: { onLogin }
    },
    requestHelpers: { login }
  } = useAppContext();
  const {
    actions: { onInitContent }
  } = useContentContext();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <ErrorBoundary>
      <header>{`What's your username and password?`}</header>
      {errorMessage && <Banner color="pink">{errorMessage}</Banner>}
      <main>
        <div style={{ width: '100%' }}>
          <div>
            <Input
              name="username"
              value={username}
              onChange={(text) => {
                setErrorMessage('');
                onSetUsername(text);
              }}
              placeholder="Enter your username"
              onKeyPress={(event) => {
                if (
                  !stringIsEmpty(username) &&
                  !stringIsEmpty(password) &&
                  event.key === 'Enter'
                ) {
                  onSubmit();
                }
              }}
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Input
              name="password"
              value={password}
              onChange={(text) => {
                setErrorMessage('');
                setPassword(text);
              }}
              placeholder="Enter your password"
              type="password"
              onKeyPress={(event) => {
                if (
                  !stringIsEmpty(username) &&
                  !stringIsEmpty(password) &&
                  event.key === 'Enter'
                ) {
                  onSubmit();
                }
              }}
            />
          </div>
        </div>
      </main>
      <footer>
        <Button
          className={css`
            font-size: 1.5rem;
            margin-right: 1rem;
            @media (max-width: ${mobileMaxWidth}) {
              max-width: 30%;
              margin-right: 0;
            }
          `}
          color="blue"
          transparent
          onClick={onShowForgotPasswordForm}
        >
          I forgot my password
        </Button>
        <Button
          className={css`
            font-size: 1.5rem;
            margin-right: 1rem;
            @media (max-width: ${mobileMaxWidth}) {
              max-width: 30%;
            }
          `}
          color="orange"
          transparent
          onClick={onShowSignupForm}
        >
          {"I don't have an account"}
        </Button>
        <Button
          color="blue"
          className={css`
            font-size: 2.5rem;
            @media (max-width: ${mobileMaxWidth}) {
              font-size: 2rem;
            }
          `}
          disabled={stringIsEmpty(username) || stringIsEmpty(password)}
          onClick={onSubmit}
        >
          Log me in!
        </Button>
      </footer>
    </ErrorBoundary>
  );

  async function onSubmit() {
    try {
      const data = await login({ username, password });
      onLogin(data);
      onInitContent({ contentType: 'user', contentId: data.id, ...data });
    } catch (error) {
      setErrorMessage(error);
    }
  }
}
