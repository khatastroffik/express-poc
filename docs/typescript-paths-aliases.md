# TypeScript Paths Aliases Configurations

In order to start the transpiled express-poc service using **node** when typescript `paths` are configured within `tsconfig.json`, the original module resolution of the node engine must be overwritten in order to resolve the (typescript) module aliases.

This can be done using the [tsconfig-paths](https://www.npmjs.com/package/tsconfig-paths) NPM library as demonstrated below.

**Important**: since the transpiled (production ready) "express-poc" is started directly with node, the `ts-config-paths` library is a direct dependency of the service and not just a dev-dependency!

## Option 1

This is the recommended option, since it has less impact on the configuration and is less error prone.

### `tsconfig.json` with extended paths definition

To resolve the aliased modules properly, the `tsconfig-paths` library consults the defined `paths` entries. Adding the paths of the transpiled modules (e.g. within the `./dist/...` build folder) is just enough.

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "rootDir": "src",
    "module": "nodenext",
    "paths": {
      "@lib/*": ["./src/lib/*", "./dist/lib/*"],
      "@mw/*": ["./src/middleware/*", "./dist/middleware/*"],
      "@modules/*": ["./src/modules/*", "./dist/modules/*"]
    }
    // ...
  }
  // ...
}
```

### `package.json` using the tsconfig-paths module registration

```json
{
  "scripts": {
    "start": "node -r tsconfig-paths/register dist/index.js"
    // ...
  }
  // ...
}
```

## Option 2

### `tsconfig.json` with cropped `rootDir`

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "rootDir": "./",
    "module": "nodenext",
    "paths": {
      "@lib/*": ["./src/lib/*"],
      "@mw/*": ["./src/middleware/*"],
      "@modules/*": ["./src/modules/*"]
    }
    // ...
  }
  // ...
}
```

### `package.json` using the tsconfig-paths module registration with specific configuration

The **baseUrl** needs to point to the *output dir* as defined in the `tsconfig.json` per `outDir` attribute. This is done using the environment variable `TS_NODE_BASEURL`.

```json
{
  "scripts": {
    "start": "TS_NODE_BASEURL=./dist node -r tsconfig-paths/register dist/src/index.js"
    // ...
  }
  // ...
}
```

 Note: the (transpiled) node script is located at "dist/**src**/index.js" due to the value of `rootDir`.
