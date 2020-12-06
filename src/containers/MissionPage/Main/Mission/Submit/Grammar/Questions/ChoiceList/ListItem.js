import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color } from 'constants/css';

ListItem.propTypes = {
  listItem: PropTypes.object.isRequired,
  index: PropTypes.number,
  onSelect: PropTypes.func.isRequired
};
export default function ListItem({ listItem, onSelect, index }) {
  return (
    <nav
      className={css`
        display: flex;
        align-items: center;
        width: 100%;
        cursor: pointer;
        &:hover {
          background: ${Color.highlightGray()};
        }
      `}
      onClick={() => onSelect(index)}
      key={index}
    >
      <section
        className={css`
          height: 4.3rem;
          width: 4.3rem;
          background: ${Color.checkboxAreaGray()};
          display: flex;
          align-items: center;
          justify-content: center;
        `}
      >
        <input
          type="checkbox"
          checked={listItem.checked}
          onChange={() => onSelect(index)}
        />
      </section>
      <div
        style={{ padding: '0 2rem' }}
        dangerouslySetInnerHTML={{ __html: listItem.label }}
      />
    </nav>
  );
}
