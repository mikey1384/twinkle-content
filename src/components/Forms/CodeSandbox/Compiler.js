import React, { createElement, memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { transformFromAstSync } from '@babel/core';
import presetReact from '@babel/preset-react';
import { parse } from './ast';

Compiler.propTypes = {
  code: PropTypes.string,
  setError: PropTypes.func,
  transformation: PropTypes.func
};

function Compiler({ code, setError, transformation }) {
  const [output, setOutput] = useState({ component: null });
  useEffect(() => {
    transpile(code, transformation, setOutput, setError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);
  const Element = output.component;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      {Element ? createElement(Element, null) : null}
    </div>
  );

  async function transpile(code, transformation, setOutput, setError) {
    try {
      const ast = transformation(parse(code));
      const component = handleGenerateElement(ast, (error) => {
        setError(error.toString());
      });
      setOutput({ component });
      setError(null);
    } catch (error) {
      setError(error.toString());
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

export default memo(
  Compiler,
  (prevProps, nextProps) => prevProps.code === nextProps.code
);
