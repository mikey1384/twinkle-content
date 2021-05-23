import React, { useRef, useEffect } from 'react';
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

  useEffect(() => {
    if (!instanceRef.current) {
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
}
