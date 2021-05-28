import traverse from '@babel/traverse';
import { parse as babelParse } from '@babel/parser';

export function parse(code) {
  return babelParse(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });
}

export function transformBeforeCompilation(ast) {
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
      }
    });
  } catch (e) {}
  return ast;
}
