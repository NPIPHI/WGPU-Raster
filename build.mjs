import * as esbuild from 'esbuild'

let ctx = await esbuild.context({
    entryPoints: ['./src/main.ts'],
    outfile: 'build/bundle.js',
    sourcemap: true,
    target: 'chrome113',
    bundle: true,
    minify: false,
    loader: {'.wgpu': 'text'},
});

await ctx.watch();
console.log("waiting");