import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import { css } from '@emotion/css';
import { Color } from 'constants/css';
import { renderText } from 'helpers/stringHelpers';

Input.propTypes = {
  hasError: PropTypes.bool,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  type: PropTypes.string
};

export default function Input({
  hasError,
  inputRef,
  onChange,
  type = 'text',
  className,
  style,
  ...props
}) {
  return (
    <ErrorBoundary>
      <input
        {...props}
        type={type}
        style={{
          border: `1px solid ${Color.darkerBorderGray()}`,
          lineHeight: '2rem',
          fontSize: '1.7rem',
          padding: '1rem',
          ...style
        }}
        className={`${
          className ||
          css`
            width: 100%;
          `
        } ${css`
          &:focus {
            outline: none;
            ::placeholder {
              color: ${Color.lighterGray()};
            }
          }
          ::placeholder {
            color: ${Color.gray()};
          }
          ${hasError ? 'color: red; border: 1px solid red;' : ''};
        `}`}
        ref={inputRef}
        onChange={(event) => onChange(renderText(event.target.value))}
      />
    </ErrorBoundary>
  );
}
