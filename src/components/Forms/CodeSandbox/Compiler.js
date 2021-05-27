import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { transformFromAstSync } from '@babel/core';
import presetReact from '@babel/preset-react';
import { parse } from './ast';

Compiler.propTypes = {
  code: PropTypes.string,
  setError: PropTypes.func,
  transformation: PropTypes.func,
  placeholder: PropTypes.node,
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

function Compiler({ code, setError, transformation, placeholder, minHeight }) {
  const [output, setOutput] = React.useState({ component: null });
  useEffect(() => {
    transpile(code, transformation, setOutput, setError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);
  const Element = output.component;
  const Placeholder = placeholder;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        minHeight: `${minHeight || 0}px`,
        paddingTop: minHeight ? '16px' : 0,
        paddingBottom: minHeight ? '16px' : 0
      }}
    >
      {Element
        ? React.createElement(Element, null)
        : Placeholder
        ? React.createElement(Placeholder, { height: minHeight || 32 })
        : null}
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
