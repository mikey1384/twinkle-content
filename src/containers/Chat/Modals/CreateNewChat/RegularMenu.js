import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import SwitchButton from 'components/Buttons/SwitchButton';
import { Color } from 'constants/css';
import { useMyState } from 'helpers/hooks';

RegularMenu.propTypes = {
  creatingChat: PropTypes.bool,
  onBackClick: PropTypes.func,
  onDone: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function RegularMenu({
  creatingChat,
  onBackClick,
  onHide,
  onDone
}) {
  const { userId } = useMyState();
  const [channelName, setChannelName] = useState('');
  const [isClosed, setIsClosed] = useState(false);

  return (
    <ErrorBoundary>
      <header>New Chat</header>
      <main>
        <div style={{ width: '100%' }}>
          <div style={{ marginTop: '1.5rem' }}>
            <h3>Group name</h3>
            <Input
              style={{ marginTop: '1rem' }}
              placeholder="Enter group name"
              maxLength="150"
              value={channelName}
              onChange={setChannelName}
            />
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <SwitchButton
              labelStyle={{ fontSize: '1.7rem', fontWeight: 'bold' }}
              label={
                <>
                  <span style={{ color: Color.logoBlue() }}>Anyone</span> can
                  invite new members:
                </>
              }
              checked={!isClosed}
              onChange={() => setIsClosed((isClosed) => !isClosed)}
            />
            <p>(You can change this setting later)</p>
          </div>
        </div>
      </main>
      <footer>
        <Button
          style={{ marginRight: '0.7rem' }}
          transparent
          onClick={onBackClick || onHide}
        >
          {onBackClick ? 'Back' : 'Cancel'}
        </Button>
        <Button
          color="blue"
          onClick={handleDone}
          disabled={creatingChat || !channelName}
        >
          Create
        </Button>
      </footer>
    </ErrorBoundary>
  );

  function handleDone() {
    onDone({ userId, channelName, isClosed });
  }
}
