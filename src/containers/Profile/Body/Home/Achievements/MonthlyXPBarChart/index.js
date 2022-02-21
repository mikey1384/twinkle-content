import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import CustomBar from './Bar';

MonthlyXPBarChart.propTypes = {
  bars: PropTypes.array.isRequired
};

export default function MonthlyXPBarChart({ bars }) {
  const barData = useMemo(() => {
    const result = [];
    for (let bar of bars) {
      result.push({ name: bar.label, XP: bar.value });
    }
    return result;
  }, [bars]);

  return (
    <div
      style={{
        marginTop: '2rem',
        width: '80%',
        height: '25rem',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip wrapperStyle={{ width: 100, backgroundColor: '#ccc' }} />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <Bar
            dataKey="XP"
            shape={<CustomBar totalLength={barData.length} />}
            barSize={30}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}