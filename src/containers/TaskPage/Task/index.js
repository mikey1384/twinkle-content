import React from 'react';
import PropTypes from 'prop-types';
import LongText from 'components/Texts/LongText';
import Submit from './Submit';
import { panel } from '../Styles';
import { gifTable } from 'constants/defaultValues';

Task.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  style: PropTypes.object,
  taskType: PropTypes.string,
  taskId: PropTypes.number
};
export default function Task({
  title,
  subtitle,
  description,
  style,
  taskType,
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
      <Submit taskType={taskType} />
    </div>
  );
}
