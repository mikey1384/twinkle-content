import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  useState,
  useMemo
} from 'react';
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

ReactCodeMirror.propTypes = {
  options: PropTypes.object,
  value: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string
};
function ReactCodeMirror(props = {}, ref) {
  const { options = {}, value = '', width = '100%', height = '100%' } = props;
  const [editor, setEditor] = useState();
  const textareaRef = useRef();
  useImperativeHandle(ref, () => ({ editor }), [editor]);
  function getEventHandleFromProps() {
    const propNames = Object.keys(props);
    const eventHandle = propNames.filter((keyName) => {
      return /^on+/.test(keyName);
    });

    const eventDict = {};
    eventHandle.forEach((ele) => {
      const name = ele.slice(2);
      if (name && name[0]) {
        eventDict[ele] = name.replace(name[0], name[0].toLowerCase());
      }
    });

    return eventDict;
  }

  // http://codemirror.net/doc/manual.html#config
  async function setOptions(instance, opt = {}) {
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

  useEffect(() => {
    if (!editor && window) {
      const instance = CodeMirror.fromTextArea(textareaRef.current, {
        ...defaultOptions,
        ...options
      });
      const eventDict = getEventHandleFromProps();
      Object.keys(eventDict).forEach((event) => {
        instance.on(eventDict[event], props[event]);
      });
      instance.setValue(value || '');

      if (width || height) {
        instance.setSize(width, height);
      }
      setEditor(instance);
      setOptions(instance, { ...defaultOptions, ...options });
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
    setOptions(editor, { ...defaultOptions, ...options });
  }, [editor, options]);

  return <textarea ref={textareaRef} />;
}

export default React.forwardRef(ReactCodeMirror);
