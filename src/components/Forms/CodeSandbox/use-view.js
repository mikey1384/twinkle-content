import { useState, useReducer, useEffect } from 'react';
import debounce from 'lodash/debounce';
// transformations, code generation
import { transformBeforeCompilation } from './ast';
import { buildPropsObj } from './utils';
import { getCode, formatCode } from './code-generator';
import {
  reset,
  updateAll,
  updateCode,
  updateProps,
  updatePropsAndCode,
  updatePropsAndCodeNoRecompile
} from './actions';
import reducer from './reducer';
const useView = (config = {}) => {
  // setting defaults
  const componentName = config.componentName ? config.componentName : '';
  const propsConfig = config.props ? config.props : {};
  const scopeConfig = config.scope ? config.scope : {};
  const importsConfig = config.imports ? config.imports : {};
  const provider = config.provider
    ? config.provider
    : {
        value: undefined,
        parse: () => undefined,
        generate: (_, child) => child,
        imports: {}
      };
  const onUpdate = config.onUpdate ? config.onUpdate : () => {};
  const customProps = config.customProps ? config.customProps : {};
  const initialCode = config.initialCode;
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState({ where: '', msg: null });
  const [state, dispatch] = useReducer(reducer, {
    code:
      initialCode ||
      getCode({
        props: propsConfig,
        componentName,
        provider,
        providerValue: provider.value,
        importsConfig,
        customProps
      }),
    codeNoRecompile: '',
    props: propsConfig,
    providerValue: provider ? provider.value : undefined
  });
  // initialize from the initialCode
  useEffect(() => {
    if (initialCode && !hydrated) {
      setHydrated(true);
      try {
        updateAll(
          dispatch,
          initialCode,
          componentName,
          propsConfig,
          provider ? provider.parse : undefined,
          customProps
        );
      } catch (e) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);
  // this callback is secretely inserted into props marked with
  // "propHook" this way we can get notified when the internal
  // state of previewed component is changed by user
  const __reactViewOnChange = debounce((propValue, propName) => {
    !hydrated && setHydrated(true);
    const newCode = getCode({
      props: buildPropsObj(state.props, { [propName]: propValue }),
      componentName,
      provider,
      providerValue: state.providerValue,
      importsConfig,
      customProps
    });
    updatePropsAndCodeNoRecompile(dispatch, newCode, propName, propValue);
    onUpdate({ code: newCode });
  }, 200);
  return {
    compilerProps: {
      code: state.code,
      setError: (msg) => setError({ where: '__compiler', msg }),
      transformations: [
        (ast) => transformBeforeCompilation(ast, componentName, propsConfig)
      ],
      scope: Object.assign(Object.assign({}, scopeConfig), {
        __reactViewOnChange
      })
    },
    knobProps: {
      state: state.props,
      error,
      set: (propValue, propName) => {
        try {
          !hydrated && setHydrated(true);
          const newCode = getCode({
            props: buildPropsObj(state.props, { [propName]: propValue }),
            componentName,
            provider,
            providerValue: state.providerValue,
            importsConfig,
            customProps
          });
          setError({ where: '', msg: null });
          if (state.codeNoRecompile !== '') {
            // fixes https://github.com/uber/react-view/issues/19
            // We don't run compiler when the state change comes from interacting
            // with the component since that causes remount and lost of focus.
            // That's a bad experience for interactions like typing. But, we
            // still want to display correct code snippet. That's why we have
            // a separate state.codeNoRecompile. The problem is that compiler runs
            // only if state.code changes and that doesn't really happen in the modal
            // case since we are only flipping a boolean flag. So state.code stays same
            // each even cycle of "open the modal through the knob and close it by its button".
            // so here we need to force an addition state.code update (aka recompile
            // with show=false
            updateCode(dispatch, state.codeNoRecompile);
            // and now we need to do the sequential state.code update with show=true
            // in the next tick
            setTimeout(() => {
              updatePropsAndCode(dispatch, newCode, propName, propValue);
              onUpdate({ code: newCode });
            }, 0);
          } else {
            updatePropsAndCode(dispatch, newCode, propName, propValue);
            onUpdate({ code: newCode });
          }
        } catch (e) {
          updateProps(dispatch, propName, propValue);
          setError({ where: propName, msg: e.toString() });
        }
      }
    },
    providerValue: state.providerValue,
    editorProps: {
      code: state.codeNoRecompile !== '' ? state.codeNoRecompile : state.code,
      onChange: (newCode) => {
        try {
          updateAll(
            dispatch,
            newCode,
            componentName,
            propsConfig,
            provider ? provider.parse : undefined,
            customProps
          );
          onUpdate({ code: newCode });
        } catch (e) {
          updateCode(dispatch, newCode);
        }
      }
    },
    errorProps: {
      msg: error.where === '__compiler' ? error.msg : null,
      code: state.code
    },
    actions: {
      formatCode: () => {
        updateCode(dispatch, formatCode(state.code));
      },
      reset: () => {
        const editorOnlyMode = Object.keys(propsConfig).length === 0;
        const providerValue = provider ? provider.value : undefined;
        const newCode = editorOnlyMode
          ? initialCode
          : getCode({
              props: propsConfig,
              componentName,
              provider,
              providerValue,
              importsConfig,
              customProps
            });
        reset(dispatch, newCode, providerValue, propsConfig);
        onUpdate({ code: newCode });
      },
      updateProp: (propName, propValue) => {
        try {
          const newCode = getCode({
            props: buildPropsObj(state.props, { [propName]: propValue }),
            componentName,
            provider,
            providerValue: state.providerValue,
            importsConfig,
            customProps
          });
          setError({ where: '', msg: null });
          updatePropsAndCode(dispatch, newCode, propName, propValue);
        } catch (e) {
          updateProps(dispatch, propName, propValue);
          setError({ where: propName, msg: e.toString() });
        }
      }
    }
  };
};

export default useView;
