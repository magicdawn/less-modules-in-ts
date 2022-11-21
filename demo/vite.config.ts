import { Plugin } from 'vite'

export function createVitePlugin(): Plugin {
  return {
    name: 'less-modules-in-ts',
    enforce: 'pre',
    transform(code, id, options) {
      //
    },
  }
}
