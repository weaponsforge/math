## math

Simple math operations for testing publishing to the NPM registry from [totaltypescript](https://www.totaltypescript.com/how-to-create-an-npm-package).

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

### 7. Turn TypeScript into a linter

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

## References

- TSConfig Cheat Sheet <sup>[[1]](https://www.totaltypescript.com/tsconfig-cheat-sheet)</sup>

@weaponsforge<br>
20250212
