import template from '@babel/template';
import * as t from '@babel/types';
import { parse } from './ast';
import prettier from '@miksu/prettier/lib/standalone';
import parsers from '@miksu/prettier/lib/language-js/parser-babylon';

export const getAstPropValue = (prop, name, customProps) => {
  const value = prop.value;
  switch (prop.type) {
    case 'string':
      return t.stringLiteral(String(value));
    case 'boolean':
      return t.booleanLiteral(Boolean(value));
    case 'enum':
      if (!value) {
        return t.identifier(String(value));
      }
      if (!prop.imports) {
        return t.stringLiteral(String(value));
      }
      const [object, property] = String(value).split('.');
      return t.memberExpression(
        t.identifier(object),
        property.includes('-')
          ? t.stringLiteral(property)
          : t.identifier(property),
        !!property.includes('-')
      );
    case 'date':
      return t.newExpression(
        t.identifier('Date'),
        value ? [t.stringLiteral(String(value))] : []
      );
    case 'ref':
      return null;
    case 'object':
      // need to add this bogus assignment so the value is recognized as an ObjectExpression
      return template.ast(`a = ${value}`, { plugins: ['jsx'] }).expression
        .right;
    case 'array':
    case 'number':
    case 'function':
    case 'react node':
      const output = template.ast(String(value), {
        plugins: ['jsx']
      }).expression;
      // we never expect that user would input a variable as the value
      // treat it as a string instead
      if (output.type === 'Identifier') {
        return t.stringLiteral(output.name);
      }
      return output;
    case 'custom':
      if (!customProps[name] || !customProps[name].generate) {
        console.error(`Missing customProps.${name}.generate definition.`);
      }
      return customProps[name].generate(value);
  }
};
export const getAstReactHooks = (props, customProps) => {
  const hooks = [];
  const buildReactHook = template(
    `const [%%name%%, %%setName%%] = React.useState(%%value%%);`
  );
  Object.keys(props).forEach((name) => {
    if (props[name].stateful === true) {
      hooks.push(
        buildReactHook({
          name: t.identifier(name),
          setName: t.identifier(`set${name[0].toUpperCase() + name.slice(1)}`),
          value: getAstPropValue(props[name], name, customProps)
        })
      );
    }
  });
  return hooks;
};
export const getAstImport = (identifiers, source, defaultIdentifier) => {
  return t.importDeclaration(
    [
      ...(defaultIdentifier
        ? [t.importDefaultSpecifier(t.identifier(defaultIdentifier))]
        : []),
      ...identifiers.map((identifier) =>
        t.importSpecifier(t.identifier(identifier), t.identifier(identifier))
      )
    ],
    t.stringLiteral(source)
  );
};
export const getAstJsxElement = (name, attrs, children) => {
  const isSelfClosing = children.length === 0;
  return t.jsxElement(
    t.jsxOpeningElement(
      t.jsxIdentifier(name),
      attrs.filter((attr) => !!attr),
      isSelfClosing
    ),
    isSelfClosing ? null : t.jsxClosingElement(t.jsxIdentifier(name)),
    children,
    true
  );
};
export const addToImportList = (importList, imports) => {
  for (const [importFrom, importNames] of Object.entries(imports)) {
    if (!importList.hasOwnProperty(importFrom)) {
      importList[importFrom] = {
        named: [],
        default: ''
      };
    }
    if (importNames.default) {
      importList[importFrom].default = importNames.default;
    }
    if (importNames.named && importNames.named.length > 0) {
      if (!importList[importFrom].hasOwnProperty('named')) {
        importList[importFrom]['named'] = [];
      }
      importList[importFrom].named = [
        ...new Set(importList[importFrom].named.concat(importNames.named))
      ];
    }
  }
};
export const getAstImports = (importsConfig, providerImports, props) => {
  // global scoped import that are always displayed
  const importList = clone(importsConfig);
  // prop level imports (typically enums related) that are displayed
  // only when the prop is being used
  Object.values(props).forEach((prop) => {
    if (
      prop.imports &&
      prop.value &&
      prop.value !== '' &&
      prop.value !== prop.defaultValue
    ) {
      addToImportList(importList, prop.imports);
    }
  });
  addToImportList(importList, providerImports);
  return Object.keys(importList).map((from) =>
    getAstImport(importList[from].named || [], from, importList[from].default)
  );
};
export const formatAstAndPrint = (ast, printWidth) => {
  const result = prettier.__debug.formatAST(ast, {
    originalText: '',
    parser: 'babel',
    printWidth: printWidth || 58,
    plugins: [parsers]
  });
  return (
    result.formatted
      // add a new line before export
      .replace(
        'export default',
        `${result.formatted.startsWith('import ') ? '\n' : ''}export default`
      )
      // remove newline at the end of file
      .replace(/[\r\n]+$/, '')
      // remove ; at the end of file
      .replace(/[;]+$/, '')
  );
};
export const formatCode = (code) => {
  return formatAstAndPrint(parse(code));
};

function clone(obj) {
  if (typeof obj === 'function') {
    return obj;
  }
  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    const value = obj[key];
    const type = {}.toString.call(value).slice(8, -1);
    if (type === 'Array' || type === 'Object') {
      result[key] = clone(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
