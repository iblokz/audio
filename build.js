import * as esbuild from 'esbuild';
import {readFileSync, writeFileSync, mkdirSync} from 'fs';
import {fileURLToPath} from 'url';
import {dirname, join} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create dist directory
mkdirSync(join(__dirname, 'dist'), {recursive: true});

// Read package.json to get version
const pkg = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf-8'));

console.log('Building CommonJS bundle...');

try {
	// Build CommonJS bundle
	await esbuild.build({
		entryPoints: ['index.js'],
		bundle: true,
		platform: 'node',
		format: 'cjs',
		outfile: 'dist/index.cjs',
		external: [],
		banner: {
			js: `/**
 * iblokz-audio v${pkg.version}
 * ${pkg.description}
 * @license ${pkg.license}
 */
`,
		},
	});

	console.log('✓ Built dist/index.cjs');

	// Build browser bundle (optional, for CDN usage)
	await esbuild.build({
		entryPoints: ['index.js'],
		bundle: true,
		platform: 'browser',
		format: 'esm',
		outfile: 'dist/index.browser.js',
		external: [],
		banner: {
			js: `/**
 * iblokz-audio v${pkg.version}
 * ${pkg.description}
 * @license ${pkg.license}
 */
`,
		},
	});

	console.log('✓ Built dist/index.browser.js');
	console.log('\nBuild completed successfully!');
} catch (error) {
	console.error('Build failed:', error);
	process.exit(1);
}

