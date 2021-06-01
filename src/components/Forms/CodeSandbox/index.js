import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Editor from './Editor';
import Button from 'components/Button';
import ErrorBoundary from 'components/ErrorBoundary';
import Icon from 'components/Icon';
import prettier from '@miksu/prettier/lib/standalone';
import parsers from '@miksu/prettier/lib/language-js/parser-babylon';
import { parse } from '@babel/parser';

CodeSandbox.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  onRunCode: PropTypes.func,
  runButtonLabel: PropTypes.string,
  simulatorRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object])
};

export default function CodeSandbox({
  code: globalCode,
  onSetCode,
  onRunCode,
  runButtonLabel = 'Run',
  simulatorRef
}) {
  const timerRef = useRef(null);
  const [runButtonDisabled, setRunButtonDisabled] = useState(false);
  const [code, setCode] = useState(globalCode);
  const [ast, setAst] = useState(null);

  return (
    <ErrorBoundary
      style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Editor
        style={{ marginTop: '2rem' }}
        value={globalCode}
        valueOnTextEditor={code}
        onChange={handleSetCode}
        onSetAst={setAst}
        ast={ast}
        onParse={handleParse}
        simulatorRef={simulatorRef}
      />
      <div
        style={{
          marginTop: '1rem',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <Button filled color="logoBlue" onClick={handleFormatCode}>
            <Icon icon="indent" />
            <span style={{ marginLeft: '0.7rem' }}>Format</span>
          </Button>
        </div>
        <div>
          {onRunCode && (
            <Button
              disabled={runButtonDisabled}
              filled
              color="green"
              onClick={handleRunCode}
            >
              <Icon icon="play" />
              <span style={{ marginLeft: '0.7rem' }}>{runButtonLabel}</span>
            </Button>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );

  function handleFormatCode() {
    onSetCode(formatCode(globalCode));
    setCode(formatCode(code));

    function formatCode(code) {
      const result = prettier.__debug.formatAST(handleParse(code), {
        originalText: '',
        parser: 'babel',
        plugins: [parsers]
      });
      return result.formatted.replace(/[\r\n]+$/, '').replace(/[;]+$/, '');
    }
  }

  function handleParse(code) {
    return parse(code, {
      sourceType: 'module',
      plugins: ['jsx']
    });
  }

  function handleRunCode() {
    onRunCode?.(ast);
  }

  function handleSetCode(text) {
    clearTimeout(timerRef.current);
    setCode(text);
    setRunButtonDisabled(true);
    timerRef.current = setTimeout(() => {
      onSetCode(text);
      setRunButtonDisabled(false);
    }, 1000);
  }
}
