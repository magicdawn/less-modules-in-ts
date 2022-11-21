/**
 * modified from https://github.com/qiniu/typed-less-modules/blob/master/lib/less/file-to-class-names.ts
 */

import Core, { Source } from 'css-modules-loader-core'
import less from 'less'
import { camelCase, kebabCase } from 'lodash'
import path from 'path'

export type NameFormat = 'camel' | 'kebab' | 'param' | 'dashes' | 'none'

export const nameFormatDefault: NameFormat = 'camel'

export const lessCodeToClassNames = async (
  lessCode: string,
  filename: string,
  nameFormat: NameFormat = 'camel',
  lessRenderOptions?: Partial<Less.Options>
): Promise<string[]> => {
  // less render
  const result = await less.render(lessCode, {
    filename: path.resolve(filename),
    syncImport: false,
    ...lessRenderOptions,
  } as Less.Options)

  // get classnames
  const { exportTokens } = await sourceToClassNames(result.css)
  const classNames = Object.keys(exportTokens)
  const transformer = classNameTransformer(nameFormat)
  const transformedClassNames = classNames.map(transformer)
  return transformedClassNames
}

interface Transformer {
  (className: string): string
}

const classNameTransformer = (nameFormat: NameFormat): Transformer => {
  switch (nameFormat) {
    case 'kebab':
    case 'param':
      return (className) => kebabCase(className)
    case 'camel':
      return (className) => camelCase(className)
    case 'dashes':
      return (className) => (/-/.test(className) ? camelCase(className) : className)
    case 'none':
      return (className) => className
  }
}

const cssModulesCore = new Core()
export const sourceToClassNames = (source: Source) => {
  return cssModulesCore.load(source)
}
