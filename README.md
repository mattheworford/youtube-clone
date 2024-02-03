# youtube-clone

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![code analysis: eslint](https://img.shields.io/badge/code_analysis-eslint-154564.svg?style=flat-square)](https://github.com/prettier/prettier)

YouTube clone implemented in TypeScript

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/current) installed on your machine.

### Installation

To install, follow the steps below:

Clone the repository to your local machine:

```bash
git clone https://github.com/mattheworford/youtube-clone.git
```

Change directory to the project folder:

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
