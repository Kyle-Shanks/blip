import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

import pkg from './package.json'

const extensions = ['.js', '.ts']

const config = [
  {
    input: 'src/index.ts',
    makeAbsoluteExternalsRelative: true,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'es',
        exports: 'named',
        sourcemap: true,
      },
    ],
    plugins: [
      commonjs({ extensions }),
      json(),
      resolve({ extensions, preferBuiltins: true }),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
]

export default config
