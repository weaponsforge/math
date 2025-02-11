## math

Simple math operations for testing publishing to the NPM registry from [totaltypescript](https://www.totaltypescript.com/how-to-create-an-npm-package).

This repository contains hands-on practice set up for:

- A TypeScript project with the latest settings
- Prettier, which both formats your code and checks that it's formatted correctly
- `@arethetypeswrong/cli`, which checks that your package exports are correct
- `tsup`, which compiles your TypeScript code to JavaScript
- `vitest`, which runs your tests
- GitHub Actions, which runs your CI process
- Changesets, which versions and publishes your package

## Steps

Summary of creating the code repository and other setup from [totaltypescript](https://www.totaltypescript.com/how-to-create-an-npm-package).

### 1. Git

<details>
<summary>Expand to view details</summary>

1. Initialize the repo
2. Setup a .gitignore
3. Create a new repository on GitHub
4. Push to GitHub
</details>

### 2. **`package.json`**

<details>
<summary>Expand to view details</summary>

1. Create a package.json file
2. Add the license field
3. Add a LICENSE file
4. Add a README file
</details>

### 3. TypeScript

<details>
<summary>Expand to view details</summary>

1. Install TypeScript<br>
`npm install --save-dev typescript`

2. Setup a `tsconfig.json` file

3. Configure your `tsconfig.json` for the DOM
   - If your code runs in the DOM (i.e. requires access to `document`, `window`, or `localStorage` etc), skip this step.
   - If your code doesn't require access to DOM API's, add the following to your tsconfig.json (This prevents the DOM typings from being available in your code):
   ```json
   {
     "compilerOptions": {
       /* other options */
       "lib": ["es2022"]
     }
   }
   ```

4. Create a source file
   - `/src/utils.ts`

5. Create an index file
   - `/src/index.ts`

6. Set up a `build` script
   - `"build": "tsc"`

7. Add `dist` to `.gitignore`

8. Set up a `CI` script
   - `"ci": "npm run build"`
</details>

### 4. Prettier

<details>
<summary>Expand to view details</summary>

1. Install Prettier
   - `npm install --save-dev prettier`

2. Set up a `.prettierrc`
   ```json
   {
     "semi": true,
     "singleQuote": true,
     "trailingComma": "all",
     "printWidth": 80,
     "tabWidth": 2
   }
   ```

3. Set up a `format` script
   - `"format": "prettier --write ."`

4. Set up a `check-format` script
   - `"check-format": "prettier --check ."`

5. Adding to our `CI` script
   - `"ci": "npm run build && npm run check-format"`
</details>

### 5. `exports`, `main` and `@arethetypeswrong/cli`

<details>
<summary>Expand to view details</summary>

**@arethetypeswrong/cli** is a tool that checks if your package exports are correct

1. Install `@arethetypeswrong/cli`
   - `npm install --save-dev @arethetypeswrong/cli`

2. Set up a `check-exports` script
   - `"check-exports": "attw --pack ."`

3. Setting `main`<br>
   Add a `main` field to your package.json with the following content:
   - `"main": "dist/index.js"`

4. Fix the CJS warning
   > If you don't want to support CJS (which I recommend), change the check-exports script to:<br>
   `"check-exports": "attw --pack . --ignore-rules=cjs-resolves-to-esm"`<br>
   > If you prefer to dual publish CJS and ESM, skip this step.

5. Adding to our `CI` script
   - `"ci": "npm run build && npm run check-format && npm run check-exports"`
</details>

### 6. Using `tsup` to Dual Publish

<details>
<summary>Expand to view details</summary>

> "If you want to publish both CJS and ESM code, you can use tsup. This is a tool built on top of esbuild that compiles your TypeScript code into both formats.
>
> My personal recommendation would be to skip this step, and only ship ES Modules. This makes your setup significantly simpler, and avoids many of the pitfalls of dual publishing, like [Dual Package Hazard](https://github.com/GeoffreyBooth/dual-package-hazard)". - totaltypescript

1. Install `tsup`
   - `npm install --save-dev tsup`
2. Create a `tsup.config.ts` file
3. Change the `build` script
   - `"build": "tsup"`
4. Add an `exports` field in the package.json
   ```json
   {
     "exports": {
       "./package.json": "./package.json",
       ".": {
         "import": "./dist/index.js",
         "default": "./dist/index.cjs"
       }
     }
   }
   ```
5. Run `npm run check-exports'
</details>

### 6.1. Turn TypeScript into a linter

<details>
<summary>Expand to view details</summary>

> "We're no longer running tsc to compile our code. And tsup doesn't actually check our code for errors - it just turns it into JavaScript.This means that our ci script won't error if we have TypeScript errors in our code. Eek. Let's fix this." - totaltypescript

1. Add `noEmit` to `tsconfig.json`
   ```json
   "compilerOptions": {
     "noEmit": true
   }
   ```

2. Remove unused fields from `tsconfig.json`<br>
   These are no longer needed in our new 'linting' setup.
   ```text
   outDir
   rootDir
   sourceMap
   declaration
   declarationMap
   ```

3. Change `module` to `Preserve`<br>
Change `module` to `Preserve` in the tsconfig.json.
   ```json
   "compilerOptions": {
     "module": "Preserve"
   }
   ```
   We can start importing TS files without `.js` extensions with this setting, e.g.:<br>
   `import { addition } from './utils'`

4. Add a `lint` script
   - `"lint": "tsc"`

5. Add `lint` to your `ci` script
   - `npm run build && npm run check-format && npm run check-exports && npm run lint`
</details>

### 7. Testing with Vitest

<details>
<summary>Expand to view details</summary>

**vitest** is a modern test runner for ESM and TypeScript.

1. Install `vitest`
   - `npm install --save-dev vitest`

2. Create a test
   - Create a `src/utils.test.ts` file with the following content:
      ```typescript
      import { add } from "./utils.js";
      import { test, expect } from "vitest";

      test("add", () => {
        expect(add(1, 2)).toBe(3);
      });
      ```

3. Set up a `test` script
   - Add a `test` script in the package.json file<br>
     `"test": "vitest run"`

4. Run the test script
   - `npm test`

5. Set up `dev` script
   - This step runs tests in watch mode while developing. Add the following the package.json file.<br>
     `"dev": "vitest"`

6. Adding to our `CI` script.
   - Add the `test` script to your `ci` script<br>
   `"ci": "npm run build && npm run check-format && npm run check-exports && npm run lint && npm run test"`
</details>

### 8. Set up CI with GitHub Actions

<details>
<summary>Expand to view details</summary>

1. Create a `.github/workflows/ci.yml` file
   - Refer to the file in the code repository.
2. Testing our workflow
   - Push the file to the repository.
   - Workflow should run on push
</details>

### 9. Publishing with Changesets

<details>
<summary>Expand to view details</summary>

> "Changesets is a tool that helps you version and publish your package. It's an incredible tool that I recommend to anyone publishing packages to npm." - totaltypescript

1. Install `@changesets/cli`
   - `npm install --save-dev @changesets/cli`

2. Initialize Changesets
   - This will create a .changeset folder in your project, containing a config.json file. This is also where your changesets will live.
   - `npx changeset init`

3. Make changesets releases public
   - Edit the `.changeset/config.json` file
   - Change the `access` field to `public`. Setting it to public allows publishing your package to npm.
      - `"access": "public"`

4. Set `commit` to `true`
   - In `.changeset/config.json`, change the `commit` field to `true`
   - This will commit the changeset to your repository after versioning.
      - `"commit": true`

5. Set up a `local-release` script
   - This script will run your CI process and then publish your package to npm. This will be the command you run when you want to release a new version of your package from your local machine.
   - Add a `local-release` script to your package.json with the following content:
      - `"local-release": "changeset version && changeset publish"`

6. Run `CI` in `prepublishOnly`
   - This runs the CI process before publishing the package to NPM
   - Add a prepublishOnly script to your package.json:
      - `"prepublishOnly": "npm run ci"`

7. Add a changeset
   - Run the command to add a changeset:
      - `npx changeset`
   - Mark the release as a `patch`, `minor` or `major` release
   - Give it a description e.g., "Initial release"
   - This will create a new file in the `.changeset` folder with the changeset.

8. Commit your changes
   - Commit your changes to your repository
      ```
      git add .
      git commit -m "Prepare for initial release"
      ```

9. Run the `local-release` script
   - Run the command to release your package
   - This will run your CI process, version your package, and publish it to npm.
   - `npm run local-release`

10. See your package on npm
   - Go to `http://npmjs.com/package/<your package name>`

11. Further reading about Changesets
   - [Changesets GitHub Action](https://github.com/changesets/action)
   - [PR Bot](https://github.com/changesets/bot)
</details>


## References

- TSConfig Cheat Sheet <sup>[[1]](https://www.totaltypescript.com/tsconfig-cheat-sheet)</sup>
- Changesets GitHub Action <sup>[[2]](https://github.com/changesets/action)</sup>
- PR Bot <sup>[[3]](https://github.com/changesets/bot)</sup>
- Dual Package Hazard <sup>[[4]](https://github.com/GeoffreyBooth/dual-package-hazard)</sup>

@weaponsforge<br>
20250212
