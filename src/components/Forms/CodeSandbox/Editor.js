import React, { useRef, useEffect, useState, useMemo } from 'react';
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
  const [editor, setEditor] = useState();
  const textareaRef = useRef();

  useEffect(() => {
    if (!editor && window) {
      const instance = CodeMirror.fromTextArea(textareaRef.current, {
        ...defaultOptions,
        ...options
      });
      instance.setValue(value || '');

      if (width || height) {
        instance.setSize(width, height);
      }
      setEditor(instance);
      handleSetOptions(instance, { ...defaultOptions, ...options });
    }
    return () => {
      if (editor && window) {
        editor.toTextArea();
        setEditor(undefined);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMemo(() => {
    if (!editor || !window) return;
    const val = editor.getValue();
    if (value !== undefined && value !== val) {
      editor.setValue(value);
    }
  }, [editor, value]);

  useMemo(() => {
    if (!editor || !window) return;
    editor.setSize(width, height);
  }, [editor, width, height]);

  useMemo(() => {
    if (!editor || !window) return;
    handleSetOptions(editor, { ...defaultOptions, ...options });
  }, [editor, options]);

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
