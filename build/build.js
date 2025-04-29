const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// Utility functions
const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

const executeCommand = (command) => {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`Error executing command: ${command}`, colors.red);
    return false;
  }
};

// Build steps
const steps = [
  {
    name: 'Clean',
    command: 'npm run clean',
    required: true,
  },
  {
    name: 'Install Dependencies',
    command: 'npm ci',
    required: true,
  },
  {
    name: 'Type Check',
    command: 'npm run type-check',
    required: true,
  },
  {
    name: 'Lint',
    command: 'npm run lint',
    required: true,
  },
  {
    name: 'Test',
    command: 'npm run test',
    required: true,
  },
  {
    name: 'Build',
    command: 'npm run build',
    required: true,
  },
];

// Main build function
const build = async () => {
  log('Starting build process...', colors.blue);

  for (const step of steps) {
    log(`\nExecuting ${step.name}...`, colors.yellow);
    
    if (!executeCommand(step.command)) {
      if (step.required) {
        log(`\n${step.name} failed. Build aborted.`, colors.red);
        process.exit(1);
      } else {
        log(`\n${step.name} failed but continuing...`, colors.yellow);
      }
    } else {
      log(`\n${step.name} completed successfully.`, colors.green);
    }
  }

  log('\nBuild completed successfully!', colors.green);
};

// Run build
build().catch((error) => {
  log(`\nBuild failed with error: ${error}`, colors.red);
  process.exit(1);
}); 