import React from 'react';
import PropTypes from 'prop-types';
import { panel } from '../../../Styles';
import Button from 'components/Button';
import Icon from 'components/Icon';

Slide.propTypes = {
  style: PropTypes.object,
  heading: PropTypes.string,
  options: PropTypes.array,
  src: PropTypes.string
};

export default function Slide({ style, heading, options, src }) {
  return (
    <div
      className={panel}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '5rem',
        ...style
      }}
    >
      {heading && (
        <p style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>{heading}</p>
      )}
      {src && (
        <div style={{ width: '80%', marginTop: '3rem' }}>
          <img style={{ width: '100%' }} src={src} />
        </div>
      )}
      {options && (
        <div
          style={{
            marginTop: '5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {options.map((option, index) => (
            <Button
              key={option.id}
              skeuomorphic
              style={{ marginTop: index === 0 ? 0 : '1rem' }}
            >
              {option.icon && <Icon icon={['fab', 'windows']} />}
              <span style={{ marginLeft: '0.7rem' }}>{option.label}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
