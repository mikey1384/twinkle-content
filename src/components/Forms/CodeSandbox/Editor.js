import React, { useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import CodeMirror from 'codemirror';
import 'codemirror/mode/meta';
import 'codemirror/lib/codemirror.css';

const defaultOptions = {
  tabSize: 2,
  autoCloseBrackets: true,
  matchBrackets: true,
  showCursorWhenSelecting: true,
  lineNumbers: true,
  fullScreen: true
};

Editor.propTypes = {
  options: PropTypes.object,
  value: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string
};
export default function Editor({
  options = {},
  value = '',
  width = '100%',
  height = '100%'
}) {
  const editorRef = useRef(null);
  const textareaRef = useRef();

  useEffect(() => {
    if (!editorRef.current) {
      const instance = CodeMirror.fromTextArea(textareaRef.current, {
        ...defaultOptions,
        ...options
      });
      instance.setValue(value || '');

      if (width || height) {
        instance.setSize(width, height);
      }
      editorRef.current = instance;
      handleSetOptions(instance, { ...defaultOptions, ...options });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMemo(() => {
    if (!editorRef.current) return;
    const val = editorRef.current.getValue();
    if (value !== undefined && value !== val) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  useMemo(() => {
    if (!editorRef.current) return;
    editorRef.current.setSize(width, height);
  }, [width, height]);

  useMemo(() => {
    if (!editorRef.current) return;
    handleSetOptions(editorRef.current, { ...defaultOptions, ...options });
  }, [options]);

  return <textarea ref={textareaRef} />;

  // http://codemirror.net/doc/manual.html#config
  async function handleSetOptions(instance, opt = {}) {
    if (typeof opt === 'object' && window) {
      const mode = CodeMirror.findModeByName(opt.mode || '');
      if (mode && mode.mode) {
        await import(`codemirror/mode/${mode.mode}/${mode.mode}.js`);
      }
      if (mode) {
        opt.mode = mode.mime;
      }
      Object.keys(opt).forEach((name) => {
        if (opt[name] && JSON.stringify(opt[name])) {
          instance.setOption(name, opt[name]);
        }
      });
    }
  }
}
