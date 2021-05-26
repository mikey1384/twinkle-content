import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Compiler from './Compiler';
import SimpleEditor from 'react-simple-code-editor';
import okaidia from 'prism-react-renderer/themes/okaidia';
import Highlight, { Prism } from 'prism-react-renderer';
import { transformBeforeCompilation } from './ast';

Editor.propTypes = {
  value: PropTypes.string,
  valueOnTextEditor: PropTypes.string,
  onChange: PropTypes.func
};
export default function Editor({ value = '', valueOnTextEditor, onChange }) {
  const [error, setError] = useState('');

  return (
    <div style={{ width: '100%' }}>
      <div>
        <Compiler
          code={value}
          transformations={[(ast) => transformBeforeCompilation(ast)]}
          minHeight={62}
          setError={(error) => setError(error)}
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <style
        dangerouslySetInnerHTML={{
          __html: `.npm__react-simple-code-editor__textarea { outline: none !important; }`
        }}
      />
      <SimpleEditor
        value={valueOnTextEditor}
        onValueChange={onChange}
        style={{
          fontSize: '14px',
          color: '#fff',
          backgroundColor: 'rgb(39, 40, 34)',
          fontFamily: `Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`,
          margin: 0
        }}
        highlight={(code) =>
          highlightCode({
            code,
            theme: okaidia
          })
        }
        padding={8}
      />
    </div>
  );

  function highlightCode({ code, theme }) {
    return (
      <Highlight Prism={Prism} code={code} theme={theme} language="jsx">
        {({ tokens, getLineProps, getTokenProps }) => (
          <>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line, key: i })}>
                {line.map((token, key) => {
                  const tokenProps = getTokenProps({ token, key });
                  return <span key={key} {...tokenProps} />;
                })}
              </div>
            ))}
          </>
        )}
      </Highlight>
    );
  }
}
