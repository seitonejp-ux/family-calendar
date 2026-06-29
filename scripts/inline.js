#!/usr/bin/env node
// Inlines all JS and CSS assets from the Vite build into a single HTML file.
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const distDir = new URL('../dist', import.meta.url).pathname;
const assetsDir = join(distDir, 'assets');

const files = readdirSync(assetsDir);
const jsFile  = files.find(f => f.endsWith('.js'));
const cssFile = files.find(f => f.endsWith('.css'));

const js  = readFileSync(join(assetsDir, jsFile),  'utf8');
const css = readFileSync(join(assetsDir, cssFile), 'utf8');

let html = readFileSync(join(distDir, 'index.html'), 'utf8');

// Replace <link rel="stylesheet" …> with inlined <style>
html = html.replace(/<link rel="stylesheet"[^>]*>/g, `<style>${css}</style>`);
// Replace <script type="module" src="…"> with inlined <script>
html = html.replace(/<script type="module" crossorigin src="[^"]*"><\/script>/g,
  `<script type="module">${js}</script>`);

const outPath = join(new URL('..', import.meta.url).pathname, 'mbti-preview.html');
writeFileSync(outPath, html, 'utf8');
console.log(`✓ Written: mbti-preview.html (${(html.length / 1024).toFixed(1)} KB)`);
