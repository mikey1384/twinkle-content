import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Compiler from './Compiler';
import SimpleEditor from 'react-simple-code-editor';
import okaidia from 'prism-react-renderer/themes/okaidia';
import Highlight, { Prism } from 'prism-react-renderer';
import traverse from '@babel/traverse';

Editor.propTypes = {
  value: PropTypes.string,
  valueOnTextEditor: PropTypes.string,
  onChange: PropTypes.func,
  onSetAst: PropTypes.func.isRequired,
  ast: PropTypes.object,
  onParse: PropTypes.func.isRequired,
  onSetErrorMsg: PropTypes.func,
  simulatorRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  style: PropTypes.object
};
export default function Editor({
  ast,
  value = '',
  valueOnTextEditor,
  onChange,
  onSetAst,
  onParse,
  onSetErrorMsg,
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
        transformation={handleTransformBeforeCompilation}
        onParse={onParse}
        onSetError={(error) => {
          setError(error);
          if (error) {
            onSetErrorMsg?.(
              `There's an error in your code. Please fix it first`
            );
          }
        }}
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
            handleHighlightCode({
              code,
              theme: okaidia
            })
          }
          padding={8}
        />
      </div>
    </div>
  );

  function handleHighlightCode({ code, theme }) {
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

  function handleTransformBeforeCompilation(ast) {
    try {
      traverse(ast, {
        VariableDeclaration(path) {
          if (path.parent.type === 'Program') {
            path.replaceWith(path.node.declarations[0].init);
          }
        },
        ImportDeclaration(path) {
          path.remove();
        },
        ExportDefaultDeclaration(path) {
          if (
            path.node.declaration.type === 'ArrowFunctionExpression' ||
            path.node.declaration.type === 'FunctionDeclaration'
          ) {
            path.replaceWith(path.node.declaration);
          } else {
            path.remove();
          }
        }
      });
    } catch (e) {}
    return ast;
  }
}
