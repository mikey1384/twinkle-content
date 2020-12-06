import React from 'react';
import PropTypes from 'prop-types';
import ListItem from './ListItem';
import { css } from 'emotion';
import { borderRadius, Color, innerBorderRadius } from 'constants/css';

ChoiceList.propTypes = {
  listItems: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  style: PropTypes.func.isRequired
};
export default function ChoiceList({ listItems, onSelect, style }) {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        width: 100%;
        nav {
          border: 1px solid ${Color.borderGray()};
          border-top: none;
        }
        nav:first-of-type {
          border: 1px solid ${Color.borderGray()};
          border-top-left-radius: ${borderRadius};
          border-top-right-radius: ${borderRadius};
          section {
            border-top-left-radius: ${innerBorderRadius};
          }
        }
        nav:last-child {
          border-bottom-left-radius: ${borderRadius};
          border-bottom-right-radius: ${borderRadius};
          section {
            border-bottom-left-radius: ${innerBorderRadius};
          }
        }
      `}
      style={style}
    >
      {listItems.map((listItem, index) => {
        return (
          <ListItem
            key={index}
            listItem={listItem}
            onSelect={onSelect}
            index={index}
          />
        );
      })}
    </div>
  );
}
