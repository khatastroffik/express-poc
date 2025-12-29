# TypeScript Express API Service PoC

An API node.js/express.js service template i.e. Proof-of-Concept written in TypeScript.

This PoC offers a *minimal-footprint* but *somehow opiniated* initial setup including the use of core libraries and tools like `typescript`, `tsx`, `jest`, `supertest`, `@antfu/eslint`, `husky`, `lint-staged`, `morgan`, `winston` and `zod` (see [Project Dependencies](#project-dependencies) below)

## Setup

### Prerequisits

The following resources/tools should be available on the OS to install/run the API service:

- node.js
- pnpm package manager
- git
- VSCode (optional)

### Automatic Setup

The simplest way to setup this application on a local system is to clone the GitHub source repository:

```shell
git clone https://github.com/khatastroffik/express-poc.git
```

Note: you may fork the repository prior cloning in order to manage changes using your own GitHub account and repository and keep traces of eventual modifications/improvements within the source repository.

### Manual setup

To manually setup this template/PoC, run the following instructions in your (unix-compliant) shell:

#### 1) setup project folder and install dependencies

```shell
mkdir express-poc
cd express-poc
pnpm init
git init
pnpm add --save-dev typescript @types/node rimraf tsx jest @types/jest ts-jest supertest @types/supertest @types/express @types/body-parser @types/morgan @types/cors cross-env eslint eslint-plugin-jest faker husky lint-staged
pnpm add express helmet cors dotenv body-parser express-rate-limit morgan http-status winston zod moment
pnpm exec tsc --init
pnpm exec ts-jest config:init
pnpm exec eslint --init
pnpm dlx @antfu/eslint-config@latest
pnpm exec husky init
pnpm install
pnpm approve-builds
```

#### 2) configure the "package.json" file

```shell
npm pkg set name="express-poc"
npm pkg set version="1.0.0"
npm pkg set description="(Proof-of-Concept) An API node.js service template written in TypeScript."
npm pkg set keywords[]="typescript" keywords[]="express" keywords[]="node.js" keywords[]="khatastroffik" keywords[]="API" keywords[]="PoC" keywords[]="template"
npm pkg set author="khatastroffik"
npm pkg set license="MIT"
npm pkg set main="src/index.js"
npm pkg set scripts.lint="eslint ."
npm pkg set scripts.lintix="eslint . --fix"
npm pkg set scripts.dev="tsx watch ./src/index.ts"
npm pkg set scripts.typecheck="tsc --noEmit"
npm pkg set scripts.test="jest --passWithNoTests"
npm pkg set scripts.build="rimraf ./dist && tsc"
npm pkg set scripts.start="node dist/index.js"
npm pkg set scripts.postpublish="git push --tags"
npm pkg set scripts.try-commit="git hook run pre-commit"
npm pkg set lint-staged["*.ts"]="pnpm lintix"
```

#### 3) complete the local repository setup

```shell
echo pnpm lint-staged >> .husky/pre-commit
mkdir src
echo // noop > src\index.ts
mkdir docs
echo # TypeScript Express API Service PoC> README.md
echo # Additional documentation> docs\README.md
```

#### 4) Adapt and Code

Feel free to adapt and complete the initial setup according to your needs and... enjoy coding!

Here are some *suggestions* for improving the setup:

- add an endpoint to publish the **swagger schema** of your API.
- add an **Heartbeat** endpoint to facilitate monitoring the API service in a managed infrastructure.
- add an **automated environment parsing** utility to the service.
- add a **validation utility** to parse the API DTOs (Data Transfer Objects) i.e. payloads and the environment settings.
- strengthen the express-server configuration!
- edit the **README** file

## Project Dependencies

### List of direct dependencies

To automatically retrieve a list of **direct project dependencies**, run the following command:

```shell
pnpm ls --lockfile-only
```

This will output something like:

```text
express-poc@1.0.0 &lt;somewhere-on-your-system&gt;\express-poc

dependencies:
body-parser 2.2.1         express 5.2.1             http-status 2.1.0         winston 3.19.0
cors 2.8.5                express-rate-limit 8.2.1  moment 2.30.1             zod 4.2.1
dotenv 17.2.3             helmet 8.1.0              morgan 1.10.1

devDependencies:
@antfu/eslint-config 6.7.3  @types/jest 30.0.0          eslint-plugin-jest 29.11.0  rimraf 6.1.2
@eslint/js 9.39.2           @types/morgan 1.9.10        faker 6.6.6                 supertest 7.1.4
@eslint/json 0.14.0         @types/node 25.0.3          globals 16.5.0              ts-jest 29.4.6
@eslint/markdown 7.5.1      @types/supertest 6.0.3      husky 9.1.7                 tsx 4.21.0
@types/body-parser 1.19.6   cross-env 10.1.0            jest 30.2.0                 typescript 5.9.3
@types/express 5.0.6        eslint 9.39.2               lint-staged 16.2.7          typescript-eslint 8.50.1
```

### List dependencies including their first level sub-dependencies

Add the parameter `--depth 1` to the call above in order to **include the first level sub-dependencies** in the resulting list (which will then be displayed as a tree).

```shell
pnpm ls --lockfile-only --depth 1
```

This will output something like:

```text
express-poc@1.0.0 &lt;somewhere-on-your-system&gt;\express-poc

dependencies:
body-parser 2.2.1
├── bytes 3.1.2
├── content-type 1.0.5
├── debug 4.4.3
├── http-errors 2.0.1
├── iconv-lite 0.7.1
├── on-finished 2.4.1
├── qs 6.14.0
├── raw-body 3.0.2
└── type-is 2.0.1
cors 2.8.5
├── object-assign 4.1.1
└── vary 1.1.2
dotenv 17.2.3
express 5.2.1
├── accepts 2.0.0
├── body-parser 2.2.1
├── ...
...
```

You can find the full list of top dependencies in the `package.json` file.
