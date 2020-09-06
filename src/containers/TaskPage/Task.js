import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import LongText from 'components/Texts/LongText';
import { panel } from './Styles';
import { gifTable } from 'constants/defaultValues';

Task.propTypes = {
  buttonLabel: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  style: PropTypes.object,
  taskId: PropTypes.number
};
export default function Task({
  buttonLabel,
  title,
  subtitle,
  description,
  style,
  taskId
}) {
  return (
    <div className={panel} style={{ paddingBottom: '3rem', ...style }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h1>{title}</h1>
          <p style={{ fontSize: '1.7rem' }}>{subtitle}</p>
        </div>
        <div style={{ width: '20%' }}>
          <img style={{ width: '100%' }} src={gifTable[taskId]} />
        </div>
      </div>
      <div
        style={{
          marginTop: '3rem',
          display: 'flex',
          justifyContent: 'center',
          fontSize: '2.3rem'
        }}
      >
        <LongText>{description}</LongText>
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}
      >
        <Button
          color="darkBlue"
          skeuomorphic
          style={{ fontSize: '2rem' }}
          onClick={() => console.log('clicked')}
        >
          {buttonLabel || 'Submit'}
        </Button>
      </div>
    </div>
  );
}
