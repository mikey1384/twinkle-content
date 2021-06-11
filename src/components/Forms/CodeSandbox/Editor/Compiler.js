import React, { createElement, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { transformFromAstSync } from '@babel/core';
import { css } from '@emotion/css';
import presetReact from '@babel/preset-react';

Compiler.propTypes = {
  code: PropTypes.string,
  ast: PropTypes.object,
  onParse: PropTypes.func.isRequired,
  onSetAst: PropTypes.func,
  onSetError: PropTypes.func,
  simulatorRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  transformation: PropTypes.func
};

export default function Compiler({
  code,
  ast,
  onParse,
  onSetError,
  onSetAst,
  simulatorRef,
  transformation
}) {
  useEffect(() => {
    transpile(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const Element = useMemo(
    () => {
      if (ast) {
        const component = handleGenerateElement(
          handleEvalCode(transformation(ast)),
          (error) => {
            onSetError(error.toString());
          }
        );
        return createElement(component, null);
      }
      return null;

      function handleGenerateElement(code, errorCallback) {
        return errorBoundary(code, errorCallback);
        function errorBoundary(Element, errorCallback) {
          class ErrorBoundary extends React.Component {
            state = { hasError: false };
            componentDidCatch(error) {
              return errorCallback(error);
            }
            render() {
              return typeof Element === 'function'
                ? createElement(Element, null)
                : Element;
            }
          }
          return ErrorBoundary;
        }
      }

      function handleEvalCode(ast) {
        const transformedCode = transformFromAstSync(ast, undefined, {
          presets: [presetReact],
          inputSourceMap: false,
          sourceMaps: false,
          comments: false
        });
        const resultCode = transformedCode ? transformedCode.code : '';
        // eslint-disable-next-line no-new-func
        const res = new Function('React', `return ${resultCode}`);
        return res(React);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ast]
  );

  return (
    <div
      style={{
        width: '100%'
      }}
      className={css`
        p {
          font-weight: normal;
        }
      `}
      ref={simulatorRef}
    >
      {Element}
    </div>
  );

  function transpile(code) {
    try {
      const ast = onParse(code);
      onSetAst(ast);
      onSetError(null);
    } catch (error) {
      onSetError(error.toString());
    }
  }
}
