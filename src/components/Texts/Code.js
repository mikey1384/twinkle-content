import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { Color } from 'constants/css';
import github from 'prism-react-renderer/themes/github';
import okaidia from 'prism-react-renderer/themes/okaidia';
import vsDark from 'prism-react-renderer/themes/vsDark';

Code.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  language: PropTypes.string,
  style: PropTypes.object,
  theme: PropTypes.string,
  codeRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
};

const availableThemes = {
  github,
  okaidia,
  vsDark
};

export default function Code({
  children,
  className,
  language = 'js',
  style,
  theme,
  codeRef
}) {
  const selectedTheme = useMemo(
    () => availableThemes?.[theme] || okaidia,
    [theme]
  );

  return (
    <Highlight
      {...defaultProps}
      theme={selectedTheme}
      code={children}
      language={language}
    >
      {({
        className: defaultClassName,
        style: defaultStyle,
        tokens,
        getLineProps,
        getTokenProps
      }) => {
        return (
          <pre
            className={`${defaultClassName} ${className}`}
            style={{
              ...defaultStyle,
              marginTop: 0,
              border: `1px solid ${Color.borderGray()}`,
              ...style
            }}
            ref={codeRef}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span key={token} {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        );
      }}
    </Highlight>
  );
}
