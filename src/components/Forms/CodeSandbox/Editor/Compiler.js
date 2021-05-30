import React, { createElement, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { transformFromAstSync } from '@babel/core';
import presetReact from '@babel/preset-react';
import { parse } from '../ast';

Compiler.propTypes = {
  code: PropTypes.string,
  output: PropTypes.func,
  onSetOutput: PropTypes.func,
  onSetError: PropTypes.func,
  transformation: PropTypes.func
};

export default function Compiler({
  code,
  output,
  onSetError,
  onSetOutput,
  transformation
}) {
  useEffect(() => {
    transpile(code, transformation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const Element = useMemo(
    () => (output ? createElement(output, null) : null),
    [output]
  );

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      {Element}
    </div>
  );

  function transpile(code, transformation) {
    try {
      const ast = transformation(parse(code));
      const component = handleGenerateElement(ast, (error) => {
        onSetError(error.toString());
      });
      onSetOutput({ component });
      onSetError(null);
    } catch (error) {
      onSetError(error.toString());
    }
  }

  function handleGenerateElement(ast, errorCallback) {
    return errorBoundary(handleEvalCode(ast), errorCallback);
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

  function errorBoundary(Element, errorCallback) {
    class ErrorBoundary extends React.Component {
      state = { hasError: false };
      componentDidCatch(error) {
        return errorCallback(error);
      }
      render() {
        return typeof Element === 'function'
          ? React.createElement(Element, null)
          : Element;
      }
    }
    return ErrorBoundary;
  }
}
