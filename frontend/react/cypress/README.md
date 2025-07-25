# Cypress E2E Testing


## Installation

**Prerequisites**
  - [system requirements](https://docs.cypress.io/app/get-started/install-cypress#System-requirements)
  - [operating system](https://docs.cypress.io/app/get-started/install-cypress#Operating-System)
  - [Node.js](https://docs.cypress.io/app/get-started/install-cypress#Nodejs)
  - [package manager](https://docs.cypress.io/app/get-started/install-cypress#Package-Manager)

- `cd frontend/react`
```bash
npm install cypress --save-dev
``` 

- This will create a `cypress` folder in your project root. 
- All the test specs will be located in `cypress/e2e`


## Adding npm Scripts

- **Add the following scripts to your `package.json` file:**

```json
{
  "scripts": {
    "cy:open": "cypress open"
  }
}
```

- **Run below command to launch Cypress**
```bash
npx cypress open
# or
yarn cypress open
```


## Launching Cypress locally on chrome

**After installing cypress through npm and following all above steps:**
 - Cypress Launchpad will open locally
 - Choose testing type to `E2E testing`
 - Quick configuration steps, choose as default by cypress
 - Go to specs and there you will see the list of all specs inside `cypress/e2e` folder that contains the `tests`
 - Select any `specs file` and you will see live running test on your browser



## Running tests on cypress launchpad

- **Install the necessary packages and start the application server by:**
```bash
cd frontend/react
npm install
# or
yarn install

npm run dev
```

- **To launch the tests on Cypress launchpad, run:**
```bash
npm run cy:open
```



## Run the tests locally in terminal

- Start the application server by:
```bash
cd frontend/react

npm run dev
# or
yarn run dev
```


- **To run tests locally, run:**
```bash
npm run test:e2e
```