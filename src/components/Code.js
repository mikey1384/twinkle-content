import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { Color } from 'constants/css';
import dracula from 'prism-react-renderer/themes/dracula';
import duotoneDark from 'prism-react-renderer/themes/duotoneDark';
import duotoneLight from 'prism-react-renderer/themes/duotoneLight';
import nightOwl from 'prism-react-renderer/themes/nightOwl';
import nightOwlLight from 'prism-react-renderer/themes/nightOwlLight';
import github from 'prism-react-renderer/themes/github';
import oceanicNext from 'prism-react-renderer/themes/oceanicNext';
import okaidia from 'prism-react-renderer/themes/okaidia';
import palenight from 'prism-react-renderer/themes/palenight';
import shadesOfPurple from 'prism-react-renderer/themes/shadesOfPurple';
import synthwave84 from 'prism-react-renderer/themes/synthwave84';
import ultramin from 'prism-react-renderer/themes/ultramin';
import vsDark from 'prism-react-renderer/themes/vsDark';
import vsLight from 'prism-react-renderer/themes/vsLight';

Code.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  language: PropTypes.string,
  style: PropTypes.object,
  theme: PropTypes.string,
  codeRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func])
};

const availableThemes = {
  dracula,
  duotoneDark,
  duotoneLight,
  github,
  nightOwl,
  nightOwlLight,
  oceanicNext,
  okaidia,
  palenight,
  shadesOfPurple,
  synthwave84,
  ultramin,
  vsDark,
  vsLight
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
