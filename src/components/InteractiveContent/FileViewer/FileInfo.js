import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { css } from 'emotion';
import {
  borderRadius,
  Color,
  desktopMinWidth,
  mobileMaxWidth
} from 'constants/css';

FileInfo.propTypes = {
  fileType: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired
};

export default function FileInfo({ src, fileType }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius
      }}
    >
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <div
          className={css`
            color: ${Color.black()};
            cursor: pointer;
            &:hover {
              color: #000;
            }
          `}
          onClick={() => window.open(src)}
        >
          <Icon
            className={css`
              font-size: 10rem;
              @media (max-width: ${mobileMaxWidth}) {
                font-size: 7rem;
              }
            `}
            icon={fileType === 'other' ? 'file' : `file-${fileType}`}
          />
        </div>
        <div
          style={{
            width: '100%',
            marginLeft: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <p
            style={{
              fontWeight: 'bold',
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end'
            }}
            onClick={() => window.open(src)}
          >
            <span
              className={css`
                cursor: pointer;
                color: ${Color.black()};
                &:hover {
                  color: #000;
                  @media (min-width: ${desktopMinWidth}) {
                    text-decoration: underline;
                  }
                }
                line-height: 1;
                @media (max-width: ${mobileMaxWidth}) {
                  font-size: 1.3rem;
                }
              `}
            >
              Download
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
