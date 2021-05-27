import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { parse as babelParse } from '@babel/parser';

export function parse(code) {
  return babelParse(code, {
    sourceType: 'module',
    plugins: [
      'jsx',
      'flowComments',
      'typescript',
      'asyncGenerators',
      'classProperties',
      'classPrivateProperties',
      'classPrivateMethods',
      [
        'decorators',
        {
          decoratorsBeforeExport: true
        }
      ],
      'doExpressions',
      'dynamicImport',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'functionBind',
      'functionSent',
      'importMeta',
      'logicalAssignment',
      'nullishCoalescingOperator',
      'numericSeparator',
      'objectRestSpread',
      'optionalCatchBinding',
      'optionalChaining',
      'partialApplication',
      'throwExpressions',
      'topLevelAwait'
    ]
  });
}
// creates a call expression that synchronizes view state
const getInstrumentOnChange = (what, into) =>
  t.callExpression(t.identifier('__reactViewOnChange'), [
    t.identifier(what),
    t.stringLiteral(into)
  ]);
// appends a call expression to a function body
const fnBodyAppend = (path, callExpression) => {
  if (path.node.type !== 'JSXExpressionContainer') {
    return;
  }
  const callbackBody = path.get('expression').get('body');
  if (callbackBody.type === 'BlockStatement') {
    // when the callback body is a block
    // e.g.: e => { setValue(e.target.value) }
    callbackBody.pushContainer('body', callExpression);
  } else {
    // when it is a single statement like e => setValue(e.target.value)
    // we have to create a BlockStatement first
    callbackBody.replaceWith(
      t.blockStatement([
        t.expressionStatement(callbackBody.node),
        t.expressionStatement(callExpression)
      ])
    );
  }
};
// removing all imports, exports and top level
// variable declaration, add __reactViewOnChange instrumentation when needed
export const transformBeforeCompilation = (ast, elementName, propsConfig) => {
  try {
    traverse(ast, {
      VariableDeclaration(path) {
        if (path.parent.type === 'Program') {
          path.replaceWith(path.node.declarations[0].init);
        }
      },
      ImportDeclaration(path) {
        path.remove();
      },
      ExportDefaultDeclaration(path) {
        if (
          path.node.declaration.type === 'ArrowFunctionExpression' ||
          path.node.declaration.type === 'FunctionDeclaration'
        ) {
          path.replaceWith(path.node.declaration);
        } else {
          path.remove();
        }
      },
      // adds internal state instrumentation through __reactViewOnChange callback
      JSXElement(path) {
        if (
          path.node.openingElement.type === 'JSXOpeningElement' &&
          path.node.openingElement.name.name === elementName
        ) {
          if (propsConfig['children'] && propsConfig['children'].propHook) {
            const propHook = propsConfig['children'].propHook;
            path.get('children').forEach((child) => {
              typeof propHook === 'object'
                ? fnBodyAppend(
                    child,
                    getInstrumentOnChange(propHook.what, propHook.into)
                  )
                : child.traverse(
                    propHook({ getInstrumentOnChange, fnBodyAppend })
                  );
            });
          }
          path
            .get('openingElement')
            .get('attributes')
            .forEach((attr) => {
              const name = attr.get('name').node.name;
              const propHook = propsConfig[name].propHook;
              if (typeof propHook !== 'undefined') {
                typeof propHook === 'object'
                  ? fnBodyAppend(
                      attr.get('value'),
                      getInstrumentOnChange(propHook.what, propHook.into)
                    )
                  : attr.traverse(
                      propHook({ getInstrumentOnChange, fnBodyAppend })
                    );
              }
            });
        }
      }
    });
  } catch (e) {}
  return ast;
};
