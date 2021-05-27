import { useState, useReducer, useEffect } from 'react';
import debounce from 'lodash/debounce';
// transformations, code generation
import { transformBeforeCompilation } from './ast';
import { buildPropsObj } from './utils';
import { getCode } from './code-generator';
import { updateAll } from './actions';
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
    errorProps: {
      msg: error.where === '__compiler' ? error.msg : null,
      code: state.code
    }
  };
};

export default useView;
