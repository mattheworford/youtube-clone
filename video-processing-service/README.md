# Video Processing Service

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![code analysis: eslint](https://img.shields.io/badge/code_analysis-eslint-154564.svg?style=flat-square)](https://github.com/prettier/prettier)

Node.js backend service for processing videos uploaded to GCS

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/current) installed on your machine.

### Installation

To install, follow the steps below:

Change directory to the VPS folder:

```bash
cd youtube-clone/video-processing-service
```

Install the required dependencies:

```bash
npm install
```

## Code Quality

### ESLint

Ensure code quality by running:

```bash
npm run lint
```

### Prettier

Enforce consistent code formatting:

```bash
npm run format
```

### Pre-Commit Hooks

Husky is set up to run ESLint and Prettier before each commit to ensure all commits meet code quality standards.
