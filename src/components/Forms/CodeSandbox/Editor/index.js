import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Compiler from './Compiler';
import SimpleEditor from 'react-simple-code-editor';
import okaidia from 'prism-react-renderer/themes/okaidia';
import Highlight, { Prism } from 'prism-react-renderer';
import { transformBeforeCompilation } from '../ast';

Editor.propTypes = {
  value: PropTypes.string,
  valueOnTextEditor: PropTypes.string,
  onChange: PropTypes.func,
  onSetAst: PropTypes.func.isRequired,
  ast: PropTypes.object,
  simulatorRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  style: PropTypes.object
};
export default function Editor({
  value = '',
  valueOnTextEditor,
  onChange,
  onSetAst,
  ast,
  simulatorRef,
  style
}) {
  const [error, setError] = useState('');

  return (
    <div style={{ width: '100%', ...style }}>
      <Compiler
        code={value}
        ast={ast}
        onSetAst={onSetAst}
        transformation={transformBeforeCompilation}
        onSetError={setError}
        simulatorRef={simulatorRef}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `.npm__react-simple-code-editor__textarea { outline: none !important; }`
        }}
      />
      <div style={{ marginTop: '2rem' }}>
        {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
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
