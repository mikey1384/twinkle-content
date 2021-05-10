import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { Color } from 'constants/css';
import dracula from 'prism-react-renderer/themes/dracula';
import github from 'prism-react-renderer/themes/github';
import vsDark from 'prism-react-renderer/themes/vsDark';
import vsLight from 'prism-react-renderer/themes/vsLight';

Code.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  language: PropTypes.string,
  style: PropTypes.object,
  theme: PropTypes.string
};

const availableThemes = {
  dracula,
  github,
  vsDark,
  vsLight
};

export default function Code({
  children,
  className,
  language = 'js',
  style,
  theme
}) {
  const selectedTheme = useMemo(() => availableThemes[theme] || vsDark, [
    theme
  ]);

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
