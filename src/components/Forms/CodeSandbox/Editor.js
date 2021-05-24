import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'codemirror';
import 'codemirror/mode/meta';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/css-lint.js';
import 'codemirror/addon/lint/lint.css';
import './material-darker.css';
import { useAppContext } from 'contexts';

const defaultOptions = {
  tabSize: 2,
  autoCloseBrackets: true,
  matchBrackets: true,
  showCursorWhenSelecting: true,
  lineNumbers: true,
  fullScreen: true,
  gutters: ['CodeMirror-lint-markers'],
  theme: 'material-darker'
};

Editor.propTypes = {
  options: PropTypes.object,
  value: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  onChange: PropTypes.func
};
export default function Editor({
  options = {},
  value = '',
  width = '100%',
  height = '100%',
  onChange
}) {
  const instanceRef = useRef(null);
  const textareaRef = useRef();
  const {
    requestHelpers: { lintCode }
  } = useAppContext();

  useEffect(() => {
    if (!instanceRef.current) {
      CodeMirror.registerHelper('lint', 'javascript', validator);
      const instance = CodeMirror.fromTextArea(textareaRef.current, {
        ...defaultOptions,
        ...options
      });
      instance.on('change', () => {
        onChange(instance.getValue());
      });
      instance.setValue(value || '');
      if (width || height) {
        instance.setSize(width, height);
      }
      handleSetOptions({
        instance,
        options: { ...defaultOptions, ...options }
      });
      instanceRef.current = instance;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <textarea ref={textareaRef} />;

  async function handleSetOptions({ instance, options = {} }) {
    if (typeof options === 'object') {
      const mode = CodeMirror.findModeByName(options.mode || '');
      if (mode && mode.mode) {
        await import(`codemirror/mode/${mode.mode}/${mode.mode}.js`);
      }
      if (mode) {
        options.mode = mode.mime;
      }
      Object.keys(options).forEach((name) => {
        if (options[name] && JSON.stringify(options[name])) {
          instance.setOption(name, options[name]);
        }
      });
    }
  }

  async function validator(text) {
    const result = [];
    const errors = await lintCode(text);
    for (var i = 0; i < errors.length; i++) {
      var error = errors[i];
      result.push({
        message: error.message,
        severity: getSeverity(error),
        from: getPos(error, true),
        to: getPos(error, false)
      });
    }
    return result;

    function getPos(error, from) {
      let line = error.line - 1;
      let ch = from ? error.column : error.column + 1;
      if (error.node && error.node.loc) {
        line = from
          ? error.node.loc.start.line - 1
          : error.node.loc.end.line - 1;
        ch = from ? error.node.loc.start.column : error.node.loc.end.column;
      }
      return CodeMirror.Pos(line, ch);
    }
    function getSeverity(error) {
      switch (error.severity) {
        case 1:
          return 'warning';
        case 2:
          return 'error';
        default:
          return 'error';
      }
    }
  }
}
