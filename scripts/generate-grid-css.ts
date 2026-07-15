/**
 * Generate grid utility CSS from constants
 * Run: npx tsx scripts/generate-grid-css.ts
 */

import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const GRID_COLUMNS = 16;
const BREAKPOINT = '64rem';

function generateGridUtilities(): string {
  let css = '/* Column start utilities (1-16) */\n';

  // Generate site-col-start-* utilities
  for (let i = 1; i <= GRID_COLUMNS; i++) {
    css += `  .site-col-start-${i} { grid-column-start: ${i}; }\n`;
  }

  css += '\n/* Column span utilities (1-16) */\n';

  // Generate site-col-span-* utilities
  for (let i = 1; i <= GRID_COLUMNS; i++) {
    css += `  .site-col-span-${i} { grid-column-end: span ${i}; }\n`;
  }

  // Generate responsive utilities
  css += `\n/* Large breakpoint: lg: prefixed utilities */\n`;
  css += `  @media (width >= ${BREAKPOINT}) {\n`;
  css += '    /* Column start */\n';

  for (let i = 1; i <= GRID_COLUMNS; i++) {
    css += `    .lg\\:site-col-start-${i} { grid-column-start: ${i}; }\n`;
  }

  css += '    /* Column span */\n';

  for (let i = 1; i <= GRID_COLUMNS; i++) {
    css += `    .lg\\:site-col-span-${i} { grid-column-end: span ${i}; }\n`;
  }

  css += '  }\n';

  return css;
}

function main() {
  const gridPath = join(process.cwd(), 'src/styles/components/grid.css');

  // Read existing file to preserve header comments
  const existing = readFileSync(gridPath, 'utf-8');
  const headerMatch = existing.match(/^([\s\S]*?)@layer utilities/);
  const header = headerMatch ? headerMatch[1] : '';

  // Generate new utilities
  const utilities = generateGridUtilities();

  // Reconstruct file
  const newContent = `${header}@layer utilities {
${utilities}}
`;

  writeFileSync(gridPath, newContent);

  console.log(`✅ Generated grid utilities for ${GRID_COLUMNS} columns`);
  console.log(`   File: src/styles/components/grid.css`);
  console.log(`   Breakpoint: ${BREAKPOINT}`);
}

main();
