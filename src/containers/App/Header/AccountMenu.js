import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import DropdownButton from 'components/Buttons/DropdownButton';
import Icon from 'components/Icon';
import { useAppContext, useChatContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import { socket } from 'constants/io';
import { addCommasToNumber } from 'helpers/stringHelpers';

AccountMenu.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object.isRequired
};

function AccountMenu({ className, history }) {
  const {
    user: {
      actions: { onLogout, onOpenSigninModal }
    }
  } = useAppContext();
  const {
    actions: { onResetChat }
  } = useChatContext();
  const {
    loggedIn,
    username,
    userId,
    managementLevel,
    twinkleCoins
  } = useMyState();
  const menuProps = useMemo(() => {
    const result = [
      {
        label: 'Profile',
        onClick: () => history.push(`/users/${username}`)
      }
    ];
    if (managementLevel > 0) {
      result.push({
        label: 'Management',
        onClick: () => history.push('/management')
      });
    }
    result.push({
      label: 'Log out',
      onClick: handleLogout
    });
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [managementLevel, username]);

  return (
    <div className="desktop" style={{ display: 'flex', alignItems: 'center' }}>
      {loggedIn && (
        <div style={{ marginRight: '1rem' }}>
          <Icon icon={['far', 'badge-dollar']} />{' '}
          {addCommasToNumber(twinkleCoins)}
        </div>
      )}
      {loggedIn ? (
        <DropdownButton
          className={className}
          transparent
          listStyle={{
            marginTop: '0.2rem',
            width: '13rem',
            marginRight: '1rem'
          }}
          direction="left"
          text={
            <div
              style={{
                maxWidth: '10rem',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
              }}
            >
              {username}
            </div>
          }
          shape="button"
          icon="caret-down"
          iconSize="lg"
          menuProps={menuProps}
        />
      ) : (
        <Button
          className={className}
          onClick={onOpenSigninModal}
          style={{ marginLeft: '1rem' }}
          color="green"
          filled
        >
          <div
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}
          >
            Log In
          </div>
        </Button>
      )}
    </div>
  );

  function handleLogout() {
    socket.emit('leave_my_notification_channel', userId);
    socket.disconnect();
    socket.connect();
    onLogout();
    onResetChat();
  }
}

export default memo(AccountMenu);
