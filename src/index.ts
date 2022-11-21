import { NameFormat } from './process-less'

export function css(...args: any): any {
  return {
    //
  }
}

// vite plugin to transform

export function createCSS(options: { nameFormat: NameFormat }) {
  return css
}
