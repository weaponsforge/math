## math

Simple math operations for testing publishing to the NPM registry from [totaltypescript](https://www.totaltypescript.com/how-to-create-an-npm-package).

## Steps

Summary of creating the code repository and other setup from [totaltypescript](https://www.totaltypescript.com/how-to-create-an-npm-package).

1. **Git**
   - Initialize the repo
   - Setup a .gitignore
   - Create a new repository on GitHub
   - Push to GitHub

2. **package.json**
   - Create a package.json file
   - Add the license field
   - Add a LICENSE file
   - Add a README file

3. **TypeScript**
   - Install TypeScript<br>
   `npm install --save-dev typescript`
   - Setup a `tsconfig.json` file
   - Configure your `tsconfig.json` for the DOM
      - If your code runs in the DOM (i.e. requires access to `document`, `window`, or `localStorage` etc), skip this step.
      - If your code doesn't require access to DOM API's, add the following to your tsconfig.json (This prevents the DOM typings from being available in your code):
      ```json
      {
        "compilerOptions": {
          // ...other options
          "lib": ["es2022"]
        }
      }
      ```
   - Create a source file
      - `/src/utils.ts`
   - Create an index file
      - `/src/index.ts`
   - Set up a `build` script
      - `"build": "tsc"`
   - Add `dist` to `.gitignore`
   - Set up a `CI` script
      - `"ci": "npm run build"`

4. **Prettier**
   - Install Prettier
      - `npm install --save-dev prettier`
   - Set up a `.prettierrc`
      ```json
      {
        "semi": true,
        "singleQuote": true,
        "trailingComma": "all",
        "printWidth": 80,
        "tabWidth": 2
      }
      ```
   - Set up a `format` script
      - `"format": "prettier --write ."`
   - Set up a `check-format` script
      - `"check-format": "prettier --check ."`
   - Adding to our `CI` script
      - `"ci": "npm run build && npm run check-format"`

5. `exports`, `main` and `@arethetypeswrong/cli`<br>
   **@arethetypeswrong/cli** is a tool that checks if your package exports are correct
   - Install `@arethetypeswrong/cli`
      - `npm install --save-dev @arethetypeswrong/cli`
   - Set up a `check-exports` script
      - `"check-exports": "attw --pack ."`
   - Setting `main`<br>
     Add a `main` field to your package.json with the following content:
        - `"main": "dist/index.js"`
   - Fix the CJS warning
      > If you don't want to support CJS (which I recommend), change the check-exports script to:<br>
      `"check-exports": "attw --pack . --ignore-rules=cjs-resolves-to-esm"`<br>
      > If you prefer to dual publish CJS and ESM, skip this step.
   - Adding to our `CI` script
      - `"ci": "npm run build && npm run check-format && npm run check-exports"`



## References

- TSConfig Cheat Sheet <sup>[[1]](https://www.totaltypescript.com/tsconfig-cheat-sheet)</sup>

@weaponsforge<br>
20250212
