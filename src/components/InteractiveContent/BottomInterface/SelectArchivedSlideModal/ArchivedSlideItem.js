import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { borderRadius, Color } from 'constants/css';

ArchivedSlideItem.propTypes = {
  slide: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function ArchivedSlideItem({ slide, style }) {
  return (
    <div
      style={style}
      className={css`
        width: 100%;
        cursor: pointer;
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        background: #fff;
        .label {
          color: ${Color.black()};
          transition: color 1s;
        }
        transition: background 0.5s, border 0.5s;
        &:hover {
          border-color: ${Color.darkerBorderGray()};
          .label {
            color: ${Color.black()};
          }
          background: ${Color.highlightGray()};
        }
      `}
    >
      <div>{slide.heading}</div>
      <div>{slide.description}</div>
    </div>
  );
}
