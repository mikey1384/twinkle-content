import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';

GoBackField.propTypes = {
  style: PropTypes.object,
  button: PropTypes.object
};

export default function GoBackField({ style, button = {} }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        ...style
      }}
    >
      <div style={{ padding: '1rem 1.5rem 1rem 0' }}>
        <Button
          onClick={() => console.log('clicked')}
          skeuomorphic
          color={button.icon ? 'black' : 'orange'}
        >
          {button.icon ? <Icon icon={button.icon} /> : <Icon icon="plus" />}
        </Button>
      </div>
      <div>edit go back</div>
    </div>
  );
}
