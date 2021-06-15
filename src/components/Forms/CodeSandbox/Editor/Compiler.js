import React, { createElement, useEffect, useMemo, useState } from 'react';
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
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) {
      onSetError({ error });
      setError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    handleTranspile(code);

    function handleTranspile(code) {
      try {
        const ast = onParse(code);
        onSetAst(ast);
        onSetError({ error: '', lineNumber: 0 });
      } catch (error) {
        const errorString = error.toString();
        onSetError({
          error: errorString,
          lineNumber: getErrorLineNumber(errorString)
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const Element = useMemo(
    () => {
      if (ast) {
        const component = handleGenerateElement(
          handleEvalCode(transformation(ast)),
          (error) => {
            const errorString = error.toString();
            onSetError({
              error: errorString,
              lineNumber: getErrorLineNumber(errorString)
            });
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
        try {
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
        } catch (error) {
          setError(error.toString());
          return null;
        }
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
        font-size: 1rem;
        p {
          font-size: 1rem;
          font-family: none;
          font-weight: normal;
          display: block;
          margin-block-start: 1em;
          margin-block-end: 1em;
          margin-inline-start: 0px;
          margin-inline-end: 0px;
        }
      `}
      ref={simulatorRef}
    >
      {Element}
    </div>
  );

  function getErrorLineNumber(errorString) {
    const firstCut = errorString?.split('(')?.[1];
    const secondCut = firstCut?.split(':')?.[0];
    const errorLineNumber = Number(secondCut);
    return isNaN(errorLineNumber) || !errorLineNumber ? 0 : errorLineNumber;
  }
}
