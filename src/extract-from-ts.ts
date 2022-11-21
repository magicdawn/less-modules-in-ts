import { parse } from '@babel/parser'
import fs from 'fs'
import traverse from '@babel/traverse'
import { lessCodeToClassNames } from './process-less'
import path from 'path'
import { upperFirst } from 'lodash'
import { format } from 'prettier'

export function extract(file: string) {
  const content = fs.readFileSync(file, 'utf-8')

  const ast = parse(content, {
    sourceType: 'unambiguous',
    plugins: ['jsx', 'typescript'],
  })

  const css: [identifier: string, code: string][] = []

  traverse(ast, {
    VariableDeclaration(path) {
      if (path.parent.type !== 'Program') return
      if (path.node.declarations.length !== 1) return

      const declaration = path.node.declarations[0]
      // console.log(declaration)

      const { id, init } = declaration
      if (id.type !== 'Identifier') return
      if (init.type !== 'TaggedTemplateExpression') return

      if (init.tag.type !== 'Identifier') return
      if (init.tag.name !== 'css') return

      // 不能有表达式
      if (init.quasi.expressions.length) return
      if (init.quasi.quasis.length !== 1) return

      // css.push([id.name, init.])
      const code = init.quasi.quasis
        .map((x) => x.value.cooked)
        .join('')
        .trim()
      css.push([id.name, code])
    },
  })

  // console.log(ast)
  // console.log(ast.program.body)
  // console.log(css)
  return css
}

// const css: [identifier: string, code: string][] = []
async function genDts(css: [identifier: string, code: string][], file: string) {
  let dtsCode = ''
  for (const [id, code] of css) {
    const clsNames = await lessCodeToClassNames(code, file, 'camel')
    // console.log(id, clsNames)

    dtsCode += `
			export interface I${upperFirst(id)} {
				${clsNames.map((cls) => `${cls}: string;`).join('\n')}
			}
		`
  }

  dtsCode = format(dtsCode, {
    parser: 'typescript',
  })

  return dtsCode
}

function getDtsFile(srcFile: string) {
  return path.join(
    path.dirname(srcFile),
    path.basename(srcFile, path.extname(srcFile)) + '.cssm.d.ts'
  )
}

main()
async function main() {
  const file = path.resolve(__dirname + '/../demo/demo.tsx')
  const css = extract(file)
  const dtsCode = await genDts(css, file)
  const dtsFile = getDtsFile(file)

  fs.writeFileSync(dtsFile, dtsCode, 'utf-8')
  console.log(dtsCode, dtsFile)
}
