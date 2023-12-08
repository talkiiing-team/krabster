import * as esbuild from 'esbuild'
import pkg from './package.json' assert { type: 'json' }
import rootPkg from '../package.json' assert { type: 'json' }

const define = {
  'process.env.NODE_ENV': '"production"',
}

const externalDeps = [pkg, rootPkg]
  .flatMap(pkg =>
    [Object.keys(pkg.dependencies), Object.keys(pkg.devDependencies)].flat(),
  )
  .flat()

console.log('Building worker')

await esbuild.build({
  entryPoints: ['src/worker.ts'],
  bundle: true,
  outfile: '../dist/server/worker.js',
  target: 'node16',
  platform: 'node',
  minify: true,
  sourcemap: 'inline',
  external: externalDeps,
  define,
})

console.log('Building app')

await esbuild.build({
  entryPoints: ['src/app.ts'],
  bundle: true,
  outfile: '../dist/server/app.js',
  target: 'node16',
  platform: 'node',
  minify: true,
  sourcemap: 'inline',
  external: externalDeps,
  define,
})
