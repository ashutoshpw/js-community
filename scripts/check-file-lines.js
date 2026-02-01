#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// The discourse directory is excluded from line limit checks
// Only js-community directory will be checked for the 500-line limit

// Configuration
const LINE_LIMIT = 500;
const EXCLUDED_PATTERNS = [
  /node_modules/,
  /vendor/,
  /dist/,
  /build/,
  /\.next/,
  /fixtures/,
  /auto_generated/,
  /public\/assets/,
  /tmp/,
  /coverage/,
];
const CODE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.gjs', '.cjs', '.mjs'];

function shouldCheckFile(filePath) {
  // Skip if doesn't exist
  if (!fs.existsSync(filePath)) return false;

  // Skip if not a code file
  const ext = path.extname(filePath);
  if (!CODE_EXTENSIONS.includes(ext)) return false;

  // Skip if in excluded directory
  if (EXCLUDED_PATTERNS.some(pattern => pattern.test(filePath))) return false;

  // Skip all files in the discourse directory (only check js-community)
  // Handle both absolute and relative paths
  if (filePath.includes('/discourse/') || filePath.startsWith('discourse/')) {
    return false;
  }

  return true;
}

function countLines(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.split('\n').length;
}

function getRefactoringSuggestions(lineCount) {
  const excess = lineCount - LINE_LIMIT;

  if (excess < 250) {
    return [
      'Extracting helper functions into separate utility files',
      'Splitting large components into smaller sub-components',
      'Moving data transformations to dedicated services',
    ];
  } else if (excess < 1000) {
    return [
      'Breaking into domain-specific modules',
      'Extracting business logic into service classes',
      'Creating separate handlers for different feature areas',
      'Using composition patterns to reduce complexity',
    ];
  } else {
    return [
      'Splitting into multiple focused modules by feature',
      'Creating a facade pattern with smaller implementation files',
      'Extracting distinct concerns into separate files',
      'Reviewing for duplicated logic that can be consolidated',
    ];
  }
}

function formatViolation(filePath, lineCount) {
  const excess = lineCount - LINE_LIMIT;
  const suggestions = getRefactoringSuggestions(lineCount);

  let message = `  ${filePath} (${lineCount.toLocaleString()} lines)\n`;

  if (excess < 250) {
    message += `    This file exceeds the limit by ${excess} lines. Consider:\n`;
  } else if (excess < 1000) {
    message += `    This file is significantly over the limit. Consider:\n`;
  } else {
    message += `    This file is ${excess.toLocaleString()} lines over the limit!\n\n`;
    message += `    This file likely has multiple responsibilities. Consider:\n`;
  }

  suggestions.forEach(suggestion => {
    message += `    • ${suggestion}\n`;
  });

  return message;
}

// Main
const args = process.argv.slice(2);
const files = args.filter(arg => !arg.startsWith('--'));

if (files.length === 0) {
  process.exit(0);
}

const violations = [];

files.forEach(filePath => {
  if (!shouldCheckFile(filePath)) return;

  const lineCount = countLines(filePath);
  if (lineCount > LINE_LIMIT) {
    violations.push({ filePath, lineCount });
  }
});

if (violations.length > 0) {
  console.error('❌ Files exceeding 500-line limit:\n');
  violations.forEach(({ filePath, lineCount }) => {
    console.error(formatViolation(filePath, lineCount));
  });
  console.error('💡 Large files are harder to understand, test, and maintain.');
  console.error('   Refactoring into smaller files improves code quality.\n');
  console.error(`Found ${violations.length} file(s) exceeding the ${LINE_LIMIT}-line limit.`);
  process.exit(1);
} else {
  process.exit(0);
}
