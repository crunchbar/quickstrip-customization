# Morphic Quickstrip Customization Tool

Morphic QCT is a react web app for making changes to your QuickStrip. Technologies used include:

  - [TypeScript](https://www.typescriptlang.org/)
  - [React](https://reactjs.org/)
  - [Material-UI](https://material-ui.com/)
  - [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd)

# Architecture

The app's source code is housed within the `src` folder. Below is the folder structure of the project with descriptions for folders. Tests are co-located along with their respective files.

```
quickstrip-customization
└───src
|   index.tsx (entry point for app)
│   └───assets (where images, fonts and other assets are located)
│   └───components (location of all components used within the app)
│   └───constants
│   └───data (location of init data for app)
│   └───hooks (custom react hooks)
│   └───interfaces (location of TS interfaces)
│   └───scss (location of styles)
│   └───utils (keyboard and data utils)
```

# Getting Started

The following scripts are available to be run within the project root directory:

#### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm start`

Serves the build folder using a static server.<br>
Open [http://localhost:5000](http://localhost:5000) to view it in the browser.
