import { transformBeforeCompilation } from './ast';

const useView = (config = {}) => {
  const componentName = config.componentName ? config.componentName : '';
  const propsConfig = config.props ? config.props : {};
  const scopeConfig = config.scope ? config.scope : {};

  return {
    compilerProps: {
      transformations: [
        (ast) => transformBeforeCompilation(ast, componentName, propsConfig)
      ],
      scope: scopeConfig
    }
  };
};

export default useView;
