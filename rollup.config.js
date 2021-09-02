import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'
import serve from 'rollup-plugin-serve'
import json from '@rollup/plugin-json'

const srcDir = 'src/'
const distDir = 'app/dist/'

const setupBuild = (src, dist, name) => {
    return {
        input: srcDir + src,
        output: {
            file: distDir + dist,
            format: 'iife',
            name,
            sourcemap: process.env.NODE_ENV === 'production' ? false : 'inline',
        },
        plugins: plugins(),
    }
}

const plugins = () => [
    typescript({ tsconfig: './tsconfig.json' }),
    process.env.NODE_ENV === 'production' && terser(),
    serve('app'),
    json({
        compact: true,
    }),
    replace({
        preventAssignment: true,
        exclude: 'node_modules/**',
        ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
    }),
]
export default [
    setupBuild('app.ts', process.env.NODE_ENV === 'production' ? 'app.min.js' : 'app.js', 'app'),
]
